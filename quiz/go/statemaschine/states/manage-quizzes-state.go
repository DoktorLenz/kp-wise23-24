package states

import "github.com/DoktorLenz/kp-wise23-24/quiz/go/user"

type ManageQuizzesState struct {
	user user.IUser
}

func (state *ManageQuizzesState) Run() IState {
	return &LoggedInState{user: state.user}
}
