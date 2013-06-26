var hydra = require('../../hydra/src/hydra-node'),
	http = require('http'),
	request = require('request'),
	express = require('express'),
	app = express();

http.globalAgent.maxSockets = 100000;
//http.globalAgent = false;

var port = parseInt(process.argv[2],10) || 5000;

var service = "time",
	hydraRefreshWait = 1000,
	errorWait = 2000,
	ajaxTimeout = 4000,
	randomWait = 5000,
	blacklistTime = 5000,
	servers = [],
	blacklist = [],
	stop = true,
	conns = 0;

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
	var hydraServers = (req.query.hydras ? req.query.hydras.split(',') : ['http://1.hydra.innotechapp.com:80']);
	service = req.query.app || 'time';
	startRequests((parseInt(req.params.connections,10) || 1), hydraServers);
	res.send(200, {host: req.headers.host, app: service, connections: conns, started: !stop});
});

app.get('/info', function(req, res){
	res.send(200, {host: req.headers.host, app: service, connections: conns, started: !stop});
});

app.get('/stop', function(req, res){
	stop = true;
	console.log('Stopping connections');
	res.send(200, {host: req.headers.host, app: service, connections: conns, started: !stop});
});

app.listen(port);
console.log('Stress-time listening on port', port);

function startRequests(connections, hydraServers) {
	console.log('Starting', connections, 'connections for', service, 'on', hydraServers);
	stop = false;
	hydra.config(hydraServers);
	updateServers();

	for ( var i = 0; i < connections; i++) {
		setTimeout(makeRequest, Math.floor(Math.random()*randomWait));
	}
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

	if(!stop) setTimeout(updateServers, hydraRefreshWait);
}

function makeRequest() {
	if (servers === null || servers.length < 1) {
		if(!stop) setTimeout(makeRequest, errorWait);
		return;
	}

	var url = servers[0];
	var options = {
		url : url,
		timeout : 6000,
		//agent: false
	};
	conns++;
	request(options, function(error, response, body) {
		conns--;
		var customWait = 0;
		if (response && response.statusCode && response.statusCode == 200) {
			customWait = randomWait;
		} else {
			//blacklistAdd(url);
		}

		if(!stop) setTimeout(makeRequest, Math.floor(Math.random()*customWait));
	});
}
