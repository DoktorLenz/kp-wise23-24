package states

import (
	"github.com/DoktorLenz/kp-wise23-24/quiz/go/user"
	"github.com/manifoldco/promptui"
)

type LoggedInState struct {
	user user.IUser
}

func (state *LoggedInState) Run() IState {
	prompt := promptui.Select{
		Label: "Hello " + state.user.GetUsername() + ", what do you want to do?",
		Items: []string{"Manage Your Quizzes", "Logout"},
	}

	_, result, _ := prompt.Run()

	switch result {
	case "Manage Your Quizzes":
		return &ManageQuizzesState{user: state.user}
	case "Logout":
		return &InitState{}
	}

	return &InitState{}
}
