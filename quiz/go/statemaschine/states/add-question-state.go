package states

import (
	"github.com/DoktorLenz/kp-wise23-24/quiz/go/quiz"
	"github.com/DoktorLenz/kp-wise23-24/quiz/go/user"
	"github.com/manifoldco/promptui"
)

type AddQuestionState struct {
	user user.IUser
	quiz *quiz.Quiz
	IState
}

type AddQuestionAction string

const (
	AddQuestionToggle         AddQuestionAction = "True/False"
	AddQuestionMultipleChoice AddQuestionAction = "Multiple Choice"
)

func (state *AddQuestionState) Run() IState {
	prompt := promptui.Select{
		Label: "What type of question do you want to add?",
		Items: []string{string(AddQuestionToggle), string(AddQuestionMultipleChoice)},
	}

	_, questionType, _ := prompt.Run()

	switch questionType {
	case string(AddQuestionToggle):
		question := state.quiz.AddQuestion(quiz.NewToggleQuestion())
		return &EditQuestionState{user: state.user, quiz: state.quiz, question: question}
	case string(AddQuestionMultipleChoice):
		panic("Not implemented yet")
	default:
		panic("Unknown action")
	}
}
