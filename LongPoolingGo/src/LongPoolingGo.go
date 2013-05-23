package main 

import (
    "net/http"
    "fmt"
    "container/list"
    "time"
)

//var messages map[string] chan string = make(map[string] chan string)
//var messages chan string  = make (chan string)
var messages = list.New()

func asyncHandler(w http.ResponseWriter, r *http.Request) {
	var ch chan string
	ch = make (chan string)
	messages.PushBack(ch)
    fmt.Fprintf(w, <-ch)
}

func sendHandler(w http.ResponseWriter, r *http.Request) {
	msg := r.URL.Path[len("/send/"):]
	var ch chan string
	startTime := time.Now()
	var count int64 = 0
	for e := messages.Front(); e != nil; e = messages.Front() {	
		ch = e.Value.(chan string)
		ch <- msg
		messages.Remove(e)
		count++
	}
	
	endTime :=time.Now()
	fmt.Fprintf(w, "Done %d request in %f ms.\n", count, endTime.Sub(startTime).Seconds() * 1000 )
}

func sleepForEver() {
	var ch = make (chan string)
	<- ch
}

func main() {
    http.HandleFunc("/async", asyncHandler)
    http.HandleFunc("/send/", sendHandler)
    go http.ListenAndServe(":2337", nil)
    fmt.Printf("Server running at http://0.0.0.0:2337/")
    sleepForEver()
}


