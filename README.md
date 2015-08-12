long-pooling-benchmark
======================

This repo provides 3 basic implementations of a long pooling http server.
In addition, it provides a client implementation in order to test each server.

## Server features

- It listen for http GET connections at **/async**
- When a GET http request to **/send/foo** is made. The server will respond to every previous connection at **/async** with the text "foo"

## Node Implementation

This will run the node long pooling server at 0.0.0.0:1337:

```
cd LongPoolingNode
node LongPoolingNode.js
```

## Golang implementation

This will run the golang long pooling server at 0.0.0.0:2337:

```
cd LongPoolingGo
go run LongPoolingGo.go
```

## Java Spring implementation

```
cd LongPoolingSpring
mvn clean install
curl -o jetty-runner.jar  http://repo2.maven.org/maven2/org/mortbay/jetty/jetty-runner/8.1.9.v20130131/jetty-runner-8.1.9.v20130131.jar
java -jar jetty-runner.jar --port 3337 target/longpooling-1.0.0-BUILD-SNAPSHOT.war
```

This will run a basic Jetty Java Spring long pooling server at 0.0.0.0:3337:

NOTE: In order to do benchmark tests I recommend to use the full version of jetty or tomcat server instead jetty-runner.

## Test client

Make connections:
```
Usage: node main.js host path port number
Example: node main.js 127.0.0.1 async 1337 50
```
The example will launch 50 GET requests towards http://127.0.0.1/async  

Respond all connections:
```
curl 127.0.0.1:1337/send/foo
```

**NOTE: Do not forget to increase max allowed open files in both server and client machines. You can use ulimit -n to check it.**

## License
Author: Germán Ramos García  
Copyright © 2015 BBVA. All rights reserved.
