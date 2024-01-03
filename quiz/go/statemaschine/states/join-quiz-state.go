package states

import (
	"errors"

	"github.com/DoktorLenz/kp-wise23-24/quiz/go/quiz"
	"github.com/DoktorLenz/kp-wise23-24/quiz/go/user"
	"github.com/DoktorLenz/kp-wise23-24/quiz/go/utils"
	"github.com/manifoldco/promptui"
)

type JoinQuizState struct {
	IState
}

func (state *JoinQuizState) Run() IState {

	availableShareCodes, err := quiz.AvailableShareCodes()
	if err != nil {
		panic(err)
	}

	prompt := promptui.Prompt{
		Label: "Enter the share code:",
		Validate: func(shareCode string) error {
			for _, code := range availableShareCodes {
				if code == shareCode {
					return nil
				}
			}
			return errors.New("Invalid share code")
		},
	}

	shareCode, _ := prompt.Run()

	quiz, err := quiz.GetQuizByShareCode(shareCode)
	if err != nil {
		panic(err)
	}

	username, err := user.GetUsernameByID(quiz.UserID)
	if err != nil {
		panic(err)
	}

	utils.Clear()
	utils.Prompt("Welcome to " + quiz.Name + " by " + username + "!")
	if quiz.Description != "" {
		utils.Prompt(quiz.Description)
	}
	utils.Prompt("")
	utils.Prompt("Press enter to start the quiz...")
	utils.AwaitInput()

	return &RunQuizState{quiz: quiz}
}
