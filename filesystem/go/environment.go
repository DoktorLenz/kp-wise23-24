package main

import (
	"github.com/doktorlenz/filesystem/core"
)

type Environment struct {
	console Console
}

func (env *Environment) Run() {
	a := core.NewDirectory("a", nil)
	b := core.NewDirectory("b", a)
	a.AddChild(b.GetAbstractFsObject())
	// env.console.Println(a.GetChildDirectory("b").GetName())
	// env.console.Println(a.GetName())

	if parent, err := a.GetChildDirectory("b").GetParent(); err == nil {
		env.console.Println(parent.GetName())
		if grandparent, err := parent.GetParent(); err == nil {
			env.console.Println(grandparent.GetName())
		} else {
			env.console.Println(err.Error())
		}
	} else {
		env.console.Println(err.Error())
	}
}

func (env *Environment) LoadGoCommands() error {
	return nil
}
