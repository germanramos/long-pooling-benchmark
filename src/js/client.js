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

  //another chunk of data has been recieved, so append it to `str`
  response.on('data', function (chunk) {
    str += chunk;
  });

  //the whole response has been recieved, so we just print it out here
  response.on('end', function () {
    console.log(str);
  });
}

console.log('Making requests ' + number);
console.log(options);

var n = 0;
var interval = setInterval(
  function (){
  	 var req=http.request(options, callback);
  	 req.on('error', function(e) {
        console.log('Problem with request: ' + n + ": " + e.message);
  	   }
      );
  	 req.end();

if ( n++ > number ) {
  clearInterval( interval );
}

  }
  ,1
);
