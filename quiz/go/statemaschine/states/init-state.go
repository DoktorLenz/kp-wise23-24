package states

import (
	"github.com/manifoldco/promptui"
)

type InitState struct{}

func (i *InitState) Run() IState {
	var options []string
	if true {
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
