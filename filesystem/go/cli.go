package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

type CLI struct{}

func (cli CLI) Read(message string) (string, error) {
	fmt.Print(message)
	reader := bufio.NewReader(os.Stdin)
	if input, err := reader.ReadString('\n'); err != nil {
		return "", err
	} else {
		input = strings.Replace(input, "\n", "", -1)
		return strings.TrimSpace(input), nil
	}
}

func (c CLI) Println(message string) {
	fmt.Println(message)
}
