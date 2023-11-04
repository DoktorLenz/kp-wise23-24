package main

import (
	"filesystem/env"
	"log"
	"os"
)

func main() {
	// Setup logger
	log.SetOutput(os.Stdout)
	log.SetFlags(log.Ldate | log.Ltime | log.Lshortfile)

	// create new CLI and Environment
	cli := env.CLI{}
	env := env.NewEnvironment(cli)

	err := env.LoadGoCommands()
	if err != nil {
		log.Fatalf("Failed to load go commands: %v", err)
	}

	env.Run()
}
