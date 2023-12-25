package states

import (
	"errors"

	"github.com/DoktorLenz/kp-wise23-24/quiz/go/user"
	"github.com/DoktorLenz/kp-wise23-24/quiz/go/utils"
	"github.com/manifoldco/promptui"
)

type RegisterState struct{}

func (state *RegisterState) Run() IState {
	username := promptUsername()
	password := promptPassword()
	promptConfirmPassword(password)

	utils.Clear()
	utils.Prompt("Creating user...")
	utils.Pause(2)
	utils.Clear()
	utils.Prompt("User created!")

	user.CreateUser(username, password)

	return &InitState{}
}

func promptUsername() string {
	prompt := promptui.Prompt{
		Label: "Username",
		Validate: func(input string) error {
			if len(input) < 3 {
				return errors.New("Username must be at least 3 characters long")
			}
			taken, _ := user.IsUsernameTaken(input)
			if taken {
				return errors.New("Username is already taken")
			}
			return nil
		},
	}
	result, _ := prompt.Run()
	return result
}

func promptPassword() string {
	prompt := promptui.Prompt{
		Label: "Password",
		Mask:  '*',
		Validate: func(input string) error {
			if len(input) < 8 {
				return errors.New("Password must be at least 8 characters long")
			}
			return nil
		},
	}
	result, _ := prompt.Run()
	return result
}

func promptConfirmPassword(password string) string {
	prompt := promptui.Prompt{
		Label: "Confirm Password",
		Mask:  '*',
		Validate: func(input string) error {
			if input != password {
				return errors.New("Passwords do not match")
			}
			return nil
		},
	}
	result, _ := prompt.Run()
	return result
}
