package states

import (
	"github.com/DoktorLenz/kp-wise23-24/quiz/go/user"
	"github.com/manifoldco/promptui"
)

type InitState struct {
	IState
}

type InitAction string

const (
	InitLogin    InitAction = "Login"
	InitRegister InitAction = "Register"
	InitJoin     InitAction = "Join Quiz"
	InitExit     InitAction = "Exit"
)

func (i *InitState) Run() IState {
	var options []string
	loginAvailable, err := user.IsAnyUserRegistered()
	if err != nil {
		panic(err)
	}
	if loginAvailable {
		options = append(options, string(InitLogin))
	}
	options = append(options, string(InitRegister), string(InitJoin), string(InitExit))

	prompt := promptui.Select{
		Label: "Welcome to THE QUIZ APP",
		Items: options,
	}

	_, result, _ := prompt.Run()

	switch result {
	case string(InitLogin):
		return &LoginState{}
	case string(InitRegister):
		return &RegisterState{}
	case string(InitJoin):
		return &InitState{}
	case string(InitExit):
		return &ExitState{}
	default:
		panic("Unknown action")
	}
}
