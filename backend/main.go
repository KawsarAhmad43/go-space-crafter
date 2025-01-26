package main

import (
	"fmt"
	"net/http"
)

var score int

func main() {
	http.HandleFunc("/score", scoreHandler)
	http.ListenAndServe(":8080", nil)
}

func scoreHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		score++
	}
	fmt.Fprintf(w, "Score: %d", score)
}
