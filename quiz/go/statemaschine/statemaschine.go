package statemaschine

import (
	"states"
)

type StateMaschine struct {
	state states.IState
}

func NewStateMachine() *StateMaschine {
	return &StateMaschine{state: &states.InitState{}}
}

func (sm *StateMaschine) Start() {
	for sm.state != nil {
		// clear ui
		sm.state = sm.state.Run()
	}
}
