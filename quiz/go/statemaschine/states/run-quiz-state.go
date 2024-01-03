package states

import (
	"github.com/DoktorLenz/kp-wise23-24/quiz/go/quiz"
	"github.com/DoktorLenz/kp-wise23-24/quiz/go/utils"
)

type RunQuizState struct {
	quiz *quiz.Quiz
}

func (state *RunQuizState) Run() IState {

	questions := state.quiz.Questions
	answers := make(map[string]bool)

	for _, question := range questions {
		answer, err := question.Ask()
		if err != nil {
			panic(err)
		}
		if answer {
			utils.Prompt("Correct!")
			answers[question.GetID()] = true
		} else {
			utils.Prompt("Wrong!")
			answers[question.GetID()] = false
		}
		utils.Prompt("")
		utils.AwaitEnter()
	}

	state.quiz.AddResponse(answers)
	state.quiz.Save()

	utils.Clear()
	utils.Prompt("You have finished the quiz!")
	utils.Prompt("Thank you for participating!")
	utils.Prompt("")
	utils.AwaitEnter()

	return &InitState{}
}
