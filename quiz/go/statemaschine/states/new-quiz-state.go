package states

import (
	"errors"

	"github.com/DoktorLenz/kp-wise23-24/quiz/go/quiz"
	"github.com/DoktorLenz/kp-wise23-24/quiz/go/user"
	"github.com/DoktorLenz/kp-wise23-24/quiz/go/utils"
	"github.com/manifoldco/promptui"
)

type NewQuizState struct {
	user user.IUser
}

func (state *NewQuizState) Run() IState {
	quizName := state.promptQuizName()

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

func (state *NewQuizState) promptQuizName() string {
	prompt := promptui.Prompt{
		Label: "How should the quiz be named?",
		Validate: func(input string) error {
			if len(input) < 1 {
				return errors.New("name must be at least 1 character long")
			}
			if len(input) > 100 {
				return errors.New("name must be at most 100 characters long")
			}
			return nil
		},
	}
	result, _ := prompt.Run()
	return result
}
