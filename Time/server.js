var http = require('http');

if (process.argv.length != 5) {
	console.log("Usage: node " + process.argv[1] + " listen_host port delay_ms");
	console.log("Example: node " + process.argv[1] + " 0.0.0.0 1337 3000");
	process.exit();
}

var host = process.argv[2]; //'0.0.0.0'
var port = parseInt(process.argv[3],10); //1337
var delay = parseInt(process.argv[4],10); //3000

http.createServer(function(req, res) {
	res.writeHead(200, {
		'Content-Type' : 'text/plain',
		'Access-Control-Allow-Origin': '*'
	});
	setTimeout(function() {
		var now = new Date();
		res.end(now.getUTCHours() + ':' + now.getUTCMinutes() + ':' + now.getUTCSeconds() + '\n');
		req.connection.end();
	}, delay);
}).listen(port, host);
console.log('Server running at http://' + host + ':' + port);
