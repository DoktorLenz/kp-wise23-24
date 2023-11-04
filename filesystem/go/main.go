package main

import (
	"log"
	"os"

	"github.com/DoktorLenz/kp-wise23-24/filesystem/go/env"
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
