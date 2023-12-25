package states

import (
	"github.com/DoktorLenz/kp-wise23-24/quiz/go/user"
	"github.com/manifoldco/promptui"
)

type InitState struct{}

func (i *InitState) Run() IState {
	var options []string
	loginAvailable, err := user.IsAnyUserRegistered()
	if err != nil {
		panic(err)
	}
	if loginAvailable {
		options = append(options, "Login")
	}
	options = append(options, "Register", "Join Quiz", "Exit")

	prompt := promptui.Select{
		Label: "Welcome to THE QUIZ APP",
		Items: options,
	}

	_, result, _ := prompt.Run()

	switch result {
	case "Login":
		return &InitState{}
	case "Register":
		return &InitState{}
	case "Join":
		return &InitState{}
	case "Exit":
		return &ExitState{}
	default:
		return &InitState{}
	}
}
