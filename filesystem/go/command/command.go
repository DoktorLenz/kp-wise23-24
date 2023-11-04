package command

import "github.com/DoktorLenz/kp-wise23-24/filesystem/go/env"

type AbstractCommand struct {
	Accessor    string
	Environment *env.Environment
	Execute     func(input string) error
}
