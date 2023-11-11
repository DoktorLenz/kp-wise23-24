package main

import (
	"github.com/DoktorLenz/kp-wise23-24/filesystem/go/core"
	"github.com/DoktorLenz/kp-wise23-24/filesystem/go/env"
)

func generator(environment *env.Environment) env.AbstractCommand {
	return env.AbstractCommand{
		Accessor:    "mkdir",
		Environment: environment,
		Execute: func(input string) error {
			environment.GetCwd().AddChild(core.NewDirectory(input, environment.GetCwd()).AbstractFsObject)
			return nil
		},
	}
}
