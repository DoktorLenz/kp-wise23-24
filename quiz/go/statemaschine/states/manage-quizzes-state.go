package states

import (
	"strconv"

	"github.com/DoktorLenz/kp-wise23-24/quiz/go/quiz"
	"github.com/DoktorLenz/kp-wise23-24/quiz/go/user"
	"github.com/gdamore/tcell/v2"
	"github.com/rivo/tview"
)

type ManageQuizzesState struct {
	user user.IUser
}

type ManageQuizzesAction int

const (
	ManageQuizzesNewQuiz  ManageQuizzesAction = 0
	ManageQuizzesEditQuiz ManageQuizzesAction = 1
	ManageQuizzesBack     ManageQuizzesAction = 2
)

func NewManageQuizzesState(user user.IUser) *ManageQuizzesState {
	return &ManageQuizzesState{user: user}
}

func (state *ManageQuizzesState) Run() IState {
	app := tview.NewApplication()
	table := tview.NewTable()
	footer := tview.NewTextView().SetText("[+] Create Quiz\r\n[-] Delete Quiz\r\n[Enter] Edit Quiz\r\n[ESC] Logout]").SetTextAlign(tview.AlignCenter).SetTextColor(tcell.ColorWhite)

	quizzes, err := quiz.GetAllQuizzesForUser(state.user.GetID())
	if err != nil {
		panic(err)
	}

	selectedQuiz, action, err := state.RunWindow(app, table, footer, quizzes)

	if err != nil {
		panic(err)
	}

	switch action {
	case ManageQuizzesNewQuiz:
		return &NewQuizState{user: state.user}
	case ManageQuizzesEditQuiz:
		return &EditQuizState{user: state.user, quiz: selectedQuiz}
	case ManageQuizzesBack:
	default:
		return &LoggedInState{user: state.user}
	}

	return &LoggedInState{user: state.user}
}

func (state *ManageQuizzesState) RunWindow(app *tview.Application, table *tview.Table, footer *tview.TextView, quizzes []*quiz.Quiz) (*quiz.Quiz, ManageQuizzesAction, error) {
	grid := tview.NewGrid().SetRows(0, 4).SetColumns(0).SetBorders(true)
	grid.AddItem(table, 0, 0, 1, 1, 0, 0, true)
	grid.AddItem(footer, 1, 0, 1, 1, 0, 0, false)

	app.SetRoot(grid, true)

	return state.RunTable(app, table, quizzes)
}

func (state *ManageQuizzesState) RunTable(app *tview.Application, table *tview.Table, quizzes []*quiz.Quiz) (*quiz.Quiz, ManageQuizzesAction, error) {
	var selectedQuiz *quiz.Quiz
	var actionAfterTable ManageQuizzesAction

	// Table
	table.SetBorders(true).SetSelectable(true, false).SetFixed(1, 2).Select(1, 0)
	table.SetSelectedFunc(func(row int, column int) {
		selectedQuiz = quizzes[row-1]
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
			if row != len(quizzes) {
				table.GetCell(row+1, 0).SetText("")
			}
		}
	})

	table.SetInputCapture(func(event *tcell.EventKey) *tcell.EventKey {
		if event.Rune() == '+' {
			app.Stop()
			actionAfterTable = ManageQuizzesNewQuiz
			// Create new Quiz
		}
		if event.Rune() == '-' {
			// Delete Quiz
			event, quizzes = state.DeleteQuiz(quizzes, event, table)
			return event
		}
		if event.Key() == tcell.KeyEscape {
			app.Stop()
			selectedQuiz = nil
			actionAfterTable = ManageQuizzesBack
		}
		return event
	})

	table.SetSelectedFunc(func(row int, column int) {
		selectedQuiz = quizzes[row-1]
		actionAfterTable = ManageQuizzesEditQuiz
		app.Stop()
	})

	table.SetSelectedStyle(tcell.Style{}.Background(tcell.ColorBlack).Foreground(tcell.ColorWhite))

	// Header
	table.SetCell(0, 0, tview.NewTableCell("").SetTextColor(tcell.ColorWhite))
	table.SetCell(0, 1, tview.NewTableCell("Quiz-Name").SetTextColor(tcell.ColorWhite))
	table.SetCell(0, 2, tview.NewTableCell("Description").SetTextColor(tcell.ColorWhite))
	table.SetCell(0, 3, tview.NewTableCell("Questioncount").SetTextColor(tcell.ColorWhite))
	table.SetCell(0, 4, tview.NewTableCell("Share-Code").SetTextColor(tcell.ColorWhite))
	table.SetCell(0, 5, tview.NewTableCell("Participations").SetTextColor(tcell.ColorWhite))

	// Content
	for i, quiz := range quizzes {
		table.SetCell(i+1, 0, tview.NewTableCell("").SetTextColor(tcell.ColorWhite))
		table.SetCell(i+1, 1, tview.NewTableCell(quiz.Name).SetTextColor(tcell.ColorWhite))
		table.SetCell(i+1, 2, tview.NewTableCell(quiz.Description).SetTextColor(tcell.ColorWhite))
		table.SetCell(i+1, 3, tview.NewTableCell(strconv.Itoa(len(quiz.Questions))).SetTextColor(tcell.ColorWhite))
		table.SetCell(i+1, 4, tview.NewTableCell(quiz.ShareCode).SetTextColor(tcell.ColorWhite))
		table.SetCell(i+1, 5, tview.NewTableCell(strconv.Itoa(len(quiz.Responses))).SetTextColor(tcell.ColorWhite))
	}

	table.GetCell(1, 0).SetText(">")

	err := app.Run()

	if err != nil {
		return nil, ManageQuizzesBack, err
	}

	return selectedQuiz, actionAfterTable, nil
}

func (state *ManageQuizzesState) DeleteQuiz(quizzes []*quiz.Quiz, event *tcell.EventKey, table *tview.Table) (*tcell.EventKey, []*quiz.Quiz) {
	if len(quizzes) == 0 {
		return event, quizzes
	}

	selectedRow, _ := table.GetSelection()

	quizToDelete := quizzes[selectedRow-1]
	var err error
	quizzes, err = quizToDelete.Delete()
	if err != nil {
		panic(err)
	}

	table.RemoveRow(selectedRow)
	if (selectedRow - 1) < len(quizzes) {
		table.Select(selectedRow, 0)
	} else {
		table.Select(selectedRow-1, 0)
	}

	return event, quizzes
}
