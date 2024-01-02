package states

import (
	"github.com/DoktorLenz/kp-wise23-24/quiz/go/quiz"
	"github.com/DoktorLenz/kp-wise23-24/quiz/go/user"
)

type EditQuestionState struct {
	user     user.IUser
	quiz     *quiz.Quiz
	question quiz.IQuestion
	IState
}

func (state *EditQuestionState) Run() IState {
	return nil
}
