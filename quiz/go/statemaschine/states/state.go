package states

type IState interface {
	Run() IState
}
