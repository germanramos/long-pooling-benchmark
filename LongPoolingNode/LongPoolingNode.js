var http = require('http');
var reqs = [];

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});

  if (req.url == "/async") {
  	reqs.push(res);
  } else if (req.url.indexOf("/send") === 0) {
  	var startTime = new Date().getTime();
  	for (var i=0; reqs.length>0; i++) {
    	reqs[0].end(req.url.slice(6));
    	reqs.shift();
  	}
  	var endTime = new Date().getTime();
  	var totalTime = endTime - startTime;
  	res.end("Done " + i + " requests in " + totalTime + "ms" );
  } else {
  	console.log("Ignoring request");
  	res.end();
  }

}).listen(1337, '0.0.0.0');
console.log('Server running at http://0.0.0.0:1337/');
