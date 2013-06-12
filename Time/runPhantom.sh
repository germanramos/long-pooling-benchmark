phantomjs phantom.js http://127.0.0.1:8080/Time/client.htm $1 >/dev/null &
top -pid $!
kill $!
