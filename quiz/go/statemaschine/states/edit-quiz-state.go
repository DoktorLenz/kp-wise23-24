package states

import (
	"github.com/DoktorLenz/kp-wise23-24/quiz/go/quiz"
	"github.com/DoktorLenz/kp-wise23-24/quiz/go/user"
	"github.com/DoktorLenz/kp-wise23-24/quiz/go/utils"
	"github.com/gdamore/tcell/v2"
	"github.com/rivo/tview"
)

type EditQuizAction int

const (
	EditQuizBack         EditQuizAction = 0
	EditQuizAddQuestion  EditQuizAction = 1
	EditQuizEditQuestion EditQuizAction = 2
)

type EditQuizState struct {
	user user.IUser
	quiz *quiz.Quiz
	IState
}

func (state *EditQuizState) Run() IState {
	app := tview.NewApplication()
	table := tview.NewTable()
	footer := tview.NewTextView().SetText("[+] Add Question\r\n[-] Delete Question\r\n[Enter] Edit Question\r\n[ESC] Back and Save").SetTextAlign(tview.AlignCenter).SetTextColor(tcell.ColorWhite)

	selectedQuestion, action, err := state.RunWindow(app, table, footer, state.quiz.Questions)

	if err != nil {
		panic(err)
	}

	switch action {
	case EditQuizAddQuestion:
		// return &AddQuestionState{user: state.user, quiz: state.quiz}
	case EditQuizEditQuestion:
		return &EditQuestionState{user: state.user, quiz: state.quiz, question: selectedQuestion}
	case EditQuizBack:
		utils.Clear()
		utils.Prompt("Saving quiz...")
		utils.Pause(2)
		utils.Clear()
		utils.Prompt("Quiz saved!")
		state.quiz.Save()
		utils.Pause(2)
		return &ManageQuizzesState{user: state.user}
	default:
		panic("Unknown action")
	}

	return &ManageQuizzesState{user: state.user}
}

func (state *EditQuizState) RunWindow(app *tview.Application, table *tview.Table, footer *tview.TextView, questions []quiz.IQuestion) (quiz.IQuestion, EditQuizAction, error) {
	grid := tview.NewGrid().SetRows(0, 4).SetColumns(0).SetBorders(true)
	grid.AddItem(table, 0, 0, 1, 1, 0, 0, true)
	grid.AddItem(footer, 1, 0, 1, 1, 0, 0, false)

	app.SetRoot(grid, true)

	return state.RunTable(app, table, questions)
}

func (state *EditQuizState) RunTable(app *tview.Application, table *tview.Table, questions []quiz.IQuestion) (quiz.IQuestion, EditQuizAction, error) {
	var selectedQuestion quiz.IQuestion
	var actionAfterTable EditQuizAction = EditQuizBack

	table.SetBorders(true).SetSelectable(true, false).SetFixed(1, 2).Select(1, 0)
	table.SetSelectedFunc(func(row int, column int) {
		selectedQuestion = questions[row-1]
		actionAfterTable = EditQuizEditQuestion
		app.Stop()
	})

	table.SetSelectionChangedFunc(func(row int, column int) {
		// Prevent Header from being selected
		if row == 0 {
			table.Select(1, 0)
		}
		if row != 0 {
			// Add selection marker
			table.GetCell(row, 0).SetText(">")

			// Remove selection marker from previous selection
			if row != 1 {
				table.GetCell(row-1, 0).SetText("")
			}
			if row != len(questions) {
				table.GetCell(row+1, 0).SetText("")
			}
		}
	})

	table.SetInputCapture(func(event *tcell.EventKey) *tcell.EventKey {
		if event.Rune() == '+' {
			app.Stop()
			actionAfterTable = EditQuizAddQuestion
		}
		if event.Rune() == '-' {
			return state.DeleteQuestion(state.quiz, event, table)
		}
		if event.Key() == tcell.KeyEscape {
			app.Stop()
			selectedQuestion = nil
			actionAfterTable = EditQuizBack
		}
		return event
	})

	table.SetSelectedStyle(tcell.Style{}.Background(tcell.ColorBlack).Foreground(tcell.ColorWhite))

	// Header
	table.SetCell(0, 0, tview.NewTableCell("").SetTextColor(tcell.ColorWhite))
	table.SetCell(0, 1, tview.NewTableCell("Question").SetTextColor(tcell.ColorWhite))
	table.SetCell(0, 2, tview.NewTableCell("Description").SetTextColor(tcell.ColorWhite))
	table.SetCell(0, 3, tview.NewTableCell("Solution").SetTextColor(tcell.ColorWhite))

	for i, question := range questions {
		table.SetCell(i+1, 0, tview.NewTableCell("").SetTextColor(tcell.ColorWhite))
		table.SetCell(i+1, 1, tview.NewTableCell(question.GetTitle()).SetTextColor(tcell.ColorWhite))
		table.SetCell(i+1, 2, tview.NewTableCell(question.GetDescription()).SetTextColor(tcell.ColorWhite))
		table.SetCell(i+1, 3, tview.NewTableCell(question.GetSolutionText()).SetTextColor(tcell.ColorWhite))
	}

	table.GetCell(1, 0).SetText(">")

	err := app.Run()

	if err != nil {
		return nil, EditQuizBack, err
	}

	return selectedQuestion, actionAfterTable, nil
}

func (state *EditQuizState) DeleteQuestion(quiz *quiz.Quiz, event *tcell.EventKey, table *tview.Table) *tcell.EventKey {
	selectedRow, _ := table.GetSelection()
	selectedQuestion := quiz.Questions[selectedRow-1]

	quiz.RemoveQuestion(selectedQuestion.GetID())

	table.RemoveRow(selectedRow)
	if (selectedRow - 1) < len(quiz.Questions) {
		table.Select(selectedRow, 0)
	} else {
		table.Select(selectedRow-1, 0)
	}
	return event
}
