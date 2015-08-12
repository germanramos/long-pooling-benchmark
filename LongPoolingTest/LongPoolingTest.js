var http = require('http');

if (process.argv.length != 6) {
	console.log("Usage: node main.js host path port number");
	console.log("Example: node main.js 127.0.0.1 home 1337 50");
	process.exit();
}

var options = {
  host: process.argv[2], //'127.0.0.1',
  path: '/' + process.argv[3],
  port: parseInt(process.argv[4]), //1337,
  method: 'GET',
  agent: false
};
var number = parseInt(process.argv[5]);

callback = function(response) {
  var str = '';

  response.on('data', function (chunk) {
    str += chunk;
  });

  response.on('end', function () {
    console.log(str);
  });
};

function logError(i) {
	return function(e) {
		console.log('Problem with request: ' + i + ": " + e.message);
	};
}

console.log('Making requests ' + number);
console.log(options);
for (var i = 0; i < number; i++) {
	console.log('Making request ' + i);
	var req = http.request(options, callback);
	req.on('error', logError(i));
	req.end();
}

console.log('Waiting');
