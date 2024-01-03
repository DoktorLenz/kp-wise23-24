package utils

import (
	"fmt"
	"time"

	"github.com/eiannone/keyboard"
)

func Prompt(message string, data ...any) {
	if message != "" {
		if data != nil {
			fmt.Printf(message, data...)
			fmt.Printf("\n")
		} else {
			fmt.Println(message)
		}
	} else {
		fmt.Println()
	}
}

func Pause(seconds time.Duration) {
	time.Sleep(seconds * time.Second)
}

func Clear() {
	fmt.Println("\033[H\033[2J")
}

func AwaitInput() {
	_, _, err := keyboard.GetSingleKey()
	if err != nil {
		panic(err)
	}
}
