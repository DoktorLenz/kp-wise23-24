package main

import (
	"github.com/DoktorLenz/kp-wise23-24/quiz/go/statemachine"
)

func main() {
	sm := statemachine.NewStateMachine()
	sm.Start()
}
