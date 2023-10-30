package main

type Environment struct {
	console Console
}

func (env *Environment) Run() {
	env.console.Println("Hello, World!")
}

func (env *Environment) LoadGoCommands() error {
	return nil
}
