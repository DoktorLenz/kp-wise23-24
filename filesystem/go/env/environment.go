package env

import (
	"log"

	"github.com/DoktorLenz/kp-wise23-24/filesystem/go/core"
)

type Environment struct {
	console                 core.Console
	rootDirectory           *core.Directory
	currentWorkingDirectory *core.Directory
	commands                map[string]*AbstractCommand
}

func NewEnvironment(console core.Console) *Environment {
	root := core.NewDirectory("/", nil)
	return &Environment{console: console, rootDirectory: root, currentWorkingDirectory: root}
}

func (env *Environment) Run() {
	var input string
	for input != "exit" {
		if input, err := env.console.Read("fs> "); err == nil {
			if input == "exit" {
				break
			}
		} else {
			log.Fatalf("Failed to read input: %v", err)
			break
		}

	}
}

func (env *Environment) LoadGoCommands() error {
	return nil
}

func (env *Environment) GetCwd() *core.Directory {
	return env.currentWorkingDirectory
}

func (env *Environment) SetCwd(dir *core.Directory) {
	env.currentWorkingDirectory = dir
}
