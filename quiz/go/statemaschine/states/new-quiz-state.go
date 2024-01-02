package states

import (
	"github.com/DoktorLenz/kp-wise23-24/quiz/go/quiz"
	"github.com/DoktorLenz/kp-wise23-24/quiz/go/user"
	"github.com/DoktorLenz/kp-wise23-24/quiz/go/utils"
)

type NewQuizState struct {
	user user.IUser
}

func (state *NewQuizState) Run() IState {
	quizName := ""

	utils.Clear()
	utils.Prompt("Creating quiz...")
	quiz, err := quiz.Create(state.user.GetID(), quizName)
	utils.Pause(2)
	utils.Clear()
	if err != nil {
		utils.Prompt("Error creating quiz: %s", err.Error())
		utils.Pause(2)
		return &LoggedInState{user: state.user}
	}
	utils.Prompt("Quiz created!")
	utils.Pause(2)

	return &EditQuizState{user: state.user, quiz: quiz}
}
