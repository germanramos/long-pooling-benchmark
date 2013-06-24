require('http').globalAgent.maxSockets = 100000;
var hydra = require('../../hydra/src/hydra-node');
	request = require('request'),
	express = require('express'),
	app = express();

var port = parseInt(process.argv[2],10) || 5000;

var service = "time",
	hydraRefreshWait = 1000,
	errorWait = 2000,
	ajaxTimeout = 4000,
	randomWait = 5000,
	blacklistTime = 5000,
	updateTimeout = null,
	intervals = [],
	servers = [],
	blacklist = [],
	pendingRequests = [],
	stop = false;

app.configure(function() {
	app.use( express.static(__dirname + '/www') );
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.errorHandler({
		dumpExceptions : true,
		showStack : true
	}));
});

app.get('/start/:connections', function(req, res){
	var hydraServer = req.query.hydra || 'http://1.hydra.innotechapp.com:80';
	stopRequests();
	startRequests((parseInt(req.params.connections,10) || 1), hydraServer);
	res.send(200, {count: intervals.length, requests: pendingRequests.length});
});

app.get('/info', function(req, res){
	res.send(200, {count: intervals.length, requests: pendingRequests.length});
});

app.get('/stop', function(req, res){
	stopRequests();
	res.send(200, {count: intervals.length, requests: pendingRequests.length});
});

app.listen(port);
console.log('Stress-time listening on port', port);

function startRequests(connections, hydraServer) {
	console.log('Starting', connections, 'connections on', hydraServer);
	hydra.config([ hydraServer ]);
	intervals.push(setInterval(updateServers, hydraRefreshWait));

	for ( var i = 0; i < connections; i++) {
		intervals.push(setInterval(makeRequest, Math.floor( Math.random() * randomWait )));
	}
}

function stopRequests() {
	console.log('Stopping connections');
	for (var r in pendingRequests) {
		pendingRequests[r].abort();
	}
	pendingRequests = [];

	for (var t in intervals) {
		clearInterval(intervals[t]);
	}
	intervals = [];
}

function blacklistAdd(url) {
	for (var i=0; i<blacklist.length; i++) {
		if (blacklist[i].url == url) {
			blacklist[i].timestamp = Date.now();
			return;
		}
	}
	console.log("Adding " + url + " to blacklist");
	blacklist.push({ url: url, timestamp : Date.now()});
}

function updateServers() {
	//Get servers from hydra
	hydra.get(service, true, function(err, result) {
		if (result !== null){
			//Clean blacklist and filter servers
			var newblacklist = [];
			var now = Date.now();
			for (var i=0; i<blacklist.length; i++) {
				if (now - blacklist[i].timestamp < blacklistTime) {
					newblacklist.push(blacklist[i]);
				} else {
					console.log("Removing " + blacklist[i].url + " from blacklist");
					continue;
				}
				var index = result.indexOf(blacklist[i].url);
				if (index >= 0) {
					console.log("Removing " + blacklist[i].url + " from updated server list");
					result.splice(index, 1);
				}
			}
			blacklist = newblacklist;
			servers = result;
		}
	});
}

function makeRequest() {
	if (servers === null || servers.length < 1) {
		return;
	}
	var url = servers[0];
	var options = {
		url : url,
		timeout : 6000
	};
	var r = request(options, function(error, response, body) {
		pendingRequests = pendingRequests.splice(pendingRequests.indexOf(r),1);

		var customWait = 0;
		if (response && response.statusCode && response.statusCode == 200) {
			customWait = randomWait;
		} else {
			blacklistAdd(url);
		}
	});
	pendingRequests.push(r);
}
