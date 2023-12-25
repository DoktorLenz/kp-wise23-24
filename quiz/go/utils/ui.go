package utils

import (
	"fmt"
	"time"
)

func Prompt(message string, data string) {
	if message != "" {
		if data != "" {
			fmt.Println(message, data)
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
