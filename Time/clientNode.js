require('http').globalAgent.maxSockets = 100000;
var hydra = require("../../hydra/src/hydra-node");
var request = require("request");

var service = "time";
var hydraRefreshWait = 1000;
var errorWait = 2000;
var ajaxTimeout = 4000;

var servers = [ "http://server1.cloud1.com:1337" ];
hydra.config([ "http://localhost:7001" ]);
// var servers = [];

updateServers();

function updateServers() {
	hydra.get("time", true, function(err, result) {
		if (result != null)
			servers = result;
			console.log(servers[0]);
	})
	setTimeout(updateServers, hydraRefreshWait);
}

function makeRequest() {
	if (servers == null || servers.length < 1) {
		setTimeout(makeRequest, errorWait);
		return;
	}

	var options = {
		url : servers[0]
	}

	request(options, function(error, response, body) {
		//console.log(body);
		if (response && response.statusCode) {
			if (response.statusCode != 200) {
				console.log("Error:" + response.statusCode);
				servers.push(servers.shift());
			} 
		} else {
			console.log("Unknow Error");
		}
		setTimeout(makeRequest, Math.floor(Math.random()*10000));
		//makeRequest();
	});

}

for ( var i = 0; i < process.argv[2]; i++) {
	setTimeout(makeRequest, Math.floor(Math.random()*10000));
	//makeRequest();
}
