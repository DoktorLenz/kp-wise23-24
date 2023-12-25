package states

type ExitState struct{}

func (i *ExitState) Run() IState {
	return nil
}
