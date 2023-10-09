package main

import "testing"

func BenchmarkSwapValue(b *testing.B) {
	var x int = 10
	var y int = 20

	for n := 0; n < b.N; n++ {
		x, y = swapValue(x, y)
	}
}

func BenchmarkSwapPointer(b *testing.B) {
	x := 10
	y := 20

	for n := 0; n < b.N; n++ {
		swapPointer(&x, &y)
	}
}

func TestSwapValue(t *testing.T) {
	x := 10
	y := 20

	x, y = swapValue(x, y)

	if x == 20 && y == 10 {
		return
	} else {
		t.Fatal("Values not swapped")
	}
}
