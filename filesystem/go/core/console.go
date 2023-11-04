package core

type Console interface {
	Read(message string) (string, error)
	Println(message string)
}
