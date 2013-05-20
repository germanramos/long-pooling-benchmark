var reqs = []
var http = require('http');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  //console.log(req.url);
  if (req.url == "/async") {
  	//console.log("Async request queued"); 
  	reqs.push(res);
  } else if (req.url.indexOf("/send") == 0) {
  	//console.log("Send request"); 
  	var startTime = new Date().getTime();
  	for (var i=0; reqs.length>0; i++) {
    	reqs[0].end(req.url.slice(6));
    	reqs.shift();
  		//console.log(i + ': Send data: ' + req.url);
  	}
  	var endTime = new Date().getTime();
  	var totalTime = endTime - startTime;
  	res.end("Done " + i + " requests in " + totalTime + "ms" );
  } else {
  	console.log("Ignoring request");
  	res.end();
  }
  
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');