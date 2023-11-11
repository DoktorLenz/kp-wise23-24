package env

type AbstractCommand struct {
	Accessor    string
	Environment *Environment
	Execute     func(input string) error
}
