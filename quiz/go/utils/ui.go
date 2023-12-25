package utils

import (
	"fmt"
	"time"
)

type UI struct{}

func (UI) Prompt(message string, data string) {
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

func (UI) Pause(seconds time.Duration) {
	time.Sleep(seconds * time.Second)
}

func (UI) Clear() {
	fmt.Println("\033[H\033[2J")
}
