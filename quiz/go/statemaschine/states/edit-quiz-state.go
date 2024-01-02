package states

import (
	"github.com/DoktorLenz/kp-wise23-24/quiz/go/quiz"
	"github.com/DoktorLenz/kp-wise23-24/quiz/go/user"
)

type EditQuizState struct {
	user user.IUser
	quiz *quiz.Quiz
}

func (state *EditQuizState) Run() IState {
	// TODO
	return nil
}
