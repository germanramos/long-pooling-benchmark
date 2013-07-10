require('http').globalAgent.maxSockets = 100000;
var hydra = require("../../hydra/src/hydra-node");
var request = require("request");

var service = "time";
var hydraRefreshWait = 1000;
var errorWait = 2000;
var ajaxTimeout = 4000;
var randomWait = 5000;
var blacklistTime = 5000;

var servers = [];
hydra.config([ "http://hydra.cloud1.com:7001" ]);
var blacklist = [];

updateServers();

function blacklistAdd(url) {
	for (var i=0; i<blacklist.length; i++) {
		if (blacklist[i].url == url) {
			blacklist[i].timestamp = new Date().getTime();
			return;
		}
	}
	console.log("Adding " + url + " to blacklist")
	blacklist.push({ url: url, timestamp : new Date().getTime()});
}

function updateServers() {
	//Get servers from hydra
	hydra.get("time", true, function(err, result) {
		if (result != null)
			//Clean blacklist and filter servers
			var newblacklist = []
			var now = new Date().getTime();
			for (var i=0; i<blacklist.length; i++) {
				if (now - blacklist[i].timestamp < blacklistTime) {
					newblacklist.push(blacklist[i]);
				} else {
					console.log("Removing " + blacklist[i].url + " from blacklist");
					continue;
				}
				var index = result.indexOf(blacklist[i].url) 
				if (index >= 0) {
					console.log("Removing " + blacklist[i].url + " from updated server list");
					result.splice(index, 1);
				}
			}
			blacklist = newblacklist;
			servers = result;	
	})

	//Program refresh
	setTimeout(updateServers, hydraRefreshWait);
}

function makeRequest() {
	if (servers == null || servers.length < 1) {
		setTimeout(makeRequest, errorWait);
		return;
	}
	var url = servers[0];
	var options = {
		url : url,
		timeout : 6000,
		//agent: false
	}
	request(options, function(error, response, body) {
		//console.log(body);
		if (response && response.statusCode && response.statusCode == 200) {
			var customWait = randomWait;
			//console.log("Ok");
		} else {
			//console.log("Error");
			//servers.push(servers.shift());	
			//servers.splice(servers.indexOf(url), 1);
			var customWait = 0;
			//blacklistAdd(url);
		}
		setTimeout(makeRequest, Math.floor(Math.random()*customWait));
		//makeRequest();
	});

}

for ( var i = 0; i < process.argv[2]; i++) {
	setTimeout(makeRequest, Math.floor(Math.random()*randomWait));
	//makeRequest();
}