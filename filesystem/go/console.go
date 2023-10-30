package main

type Console interface {
	Read(message string) (string, error)
	Println(message string)
}
