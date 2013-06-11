var system = require('system');

if (system.args.length != 3) {
	console.log("Use: phantomjs " + system.args[0] + " url instances");
	phantom.exit();
}

var url = system.args[1]; //'http://127.0.0.1:8020/Time/client.htm';
var instances = parseInt(system.args[2]);
var count = 0

for (var i=0; i<instances; i++) {
	var page = require('webpage').create();
	page.open(url, function (status) {
	    console.log('Page ' + url + ' is loaded ' + count);
	    count++;
	});
}

console.log("Total instances: " + instances);
