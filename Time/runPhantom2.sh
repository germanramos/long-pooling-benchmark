#!/bin/bash
ulimit -Sn 4096
for i in $(seq 1 $1)
do
   phantomjs phantom.js http://127.0.0.1:8080/Time/client.htm 25 >/dev/null &
done
top
killall phantomjs
