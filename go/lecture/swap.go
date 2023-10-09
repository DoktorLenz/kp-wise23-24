package main

func swapValue(x int, y int) (int, int) {
	return y, x
}

func swapPointer(x *int, y *int) {
	z := *x
	*x = *y
	*y = z
}
