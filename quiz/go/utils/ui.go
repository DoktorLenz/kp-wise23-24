package utils

import (
	"bufio"
	"fmt"
	"os"
	"time"
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

func AwaitEnter() {
	reader := bufio.NewReader(os.Stdin)
	Prompt("Press Enter to continue...")
	reader.ReadString('\n')
}
