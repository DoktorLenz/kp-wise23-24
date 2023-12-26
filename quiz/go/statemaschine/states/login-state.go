package states

import (
	"github.com/DoktorLenz/kp-wise23-24/quiz/go/user"
	"github.com/DoktorLenz/kp-wise23-24/quiz/go/utils"
	"github.com/manifoldco/promptui"
)

type LoginState struct{}

func (state *LoginState) Run() IState {
	username := state.promptUsername()
	password := state.promptPassword()

	u, err := user.CheckLogin(username, password)
	if err != nil {
		panic(err)
	}

	if u == nil {
		utils.Prompt("Invalid username or password")
		utils.Pause(2)
		return &LoginState{}
	} else {
		return &LoggedInState{user: u}
	}
}

func (state *LoginState) promptUsername() string {
	prompt := promptui.Prompt{
		Label: "Username",
	}

	result, _ := prompt.Run()
	return result
}

func (state *LoginState) promptPassword() string {
	prompt := promptui.Prompt{
		Label: "Password",
		Mask:  '*',
	}

	result, _ := prompt.Run()
	return result
}
