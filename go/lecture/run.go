package main

import "fmt"

func main() {
	swap()
}

func swap() {
	var x int = 10
	var y int = 20

	fmt.Printf("Initial\n")
	fmt.Printf("x=%d\n", x)
	fmt.Printf("y=%d\n", y)
	fmt.Printf("----------\n")

	x, y = swapValue(x, y)

	fmt.Printf("SwapValue\n")
	fmt.Printf("x=%d\n", x)
	fmt.Printf("y=%d\n", y)
	fmt.Printf("----------\n")

	swapPointer(&x, &y)

	fmt.Printf("SwapPointer\n")
	fmt.Printf("x=%d\n", x)
	fmt.Printf("y=%d\n", y)
	fmt.Printf("----------\n")
}
