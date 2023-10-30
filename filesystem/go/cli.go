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
	input, err := reader.ReadString('\n')
	if err != nil {
		return "", err
	}
	return strings.TrimSpace(input), nil
}

func (c CLI) Println(message string) {
	fmt.Println(message)
}
