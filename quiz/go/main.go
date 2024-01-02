package main

import (
	"github.com/DoktorLenz/kp-wise23-24/quiz/go/statemaschine/states"
	"github.com/DoktorLenz/kp-wise23-24/quiz/go/user"
)

func main() {
	// sm := statemaschine.NewStateMachine()
	// sm.Start()

	u, _ := user.CheckLogin("admin", "adminadmin")
	manage := states.NewManageQuizzesState(u)
	manage.Run()

	// tq := quiz.ToggleQuestion{
	// 	Question: quiz.Question{
	// 		Solution: true,
	// 	},
	// 	TrueText:  "True",
	// 	FalseText: "False",
	// }

	// tq.Edit()

	// utils.Prompt(tq.GetSolutionText())
}
