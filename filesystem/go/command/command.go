package command

import "filesystem/env"

type AbstractCommand struct {
	Accessor    string
	Environment *env.Environment
	Execute     func(input string) error
}
