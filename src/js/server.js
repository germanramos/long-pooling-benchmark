load('vertx.js')

var reqs = [];

vertx.createHttpServer().requestHandler(
	function(req) {
 

console.log( req.path );

		req.response.statusCode = 200;
		req.response.putHeader("content-type", "text/plain");
		req.response.setChunked(true);

		if ( req.path === "/async" ) {
			reqs[reqs.length] = req.response;
		}
		else if ( req.path.indexOf("/send") === 0 ) {
			var startTime = new Date().getTime();
  			for (var i=0; reqs.length>0; i++) {
  				reqs[0].write( req.path.slice(6) );
    			reqs[0].end();
    			reqs.shift();
    		}
  			var totalTime = new Date().getTime() - startTime;
  			req.response.write( "Done " + i + " requests in " + totalTime + "ms" );
  			req.response.end();
  		} 
  		else {
  			console.log("Ignoring request");
  			req.response.end();
		}

	}
)
.listen(1337, '127.0.0.1')
;

console.log('Server running at http://127.0.0.1:1337/');
