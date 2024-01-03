package states

import "github.com/DoktorLenz/kp-wise23-24/quiz/go/quiz"

type RunQuizState struct {
	quiz *quiz.Quiz
}

func (state *RunQuizState) Run() IState {
	return nil
}
