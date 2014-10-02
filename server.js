var url = require("url");
var https = require("http");

function start(route,handle) {
	function onRequest(request, response) {
		// Website you wish to allow to connect
		response.setHeader('Access-Control-Allow-Origin', null);
		// Request methods you wish to allow
		response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
		// Request headers you wish to allow
		response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
		// Set to true if you need the website to include cookies in the requests sent
		// to the API (e.g. in case you use sessions)
		response.setHeader('Access-Control-Allow-Credentials', true);
	
		var pathname = url.parse(request.url).pathname;
		if( pathname !== "/favicon.ico" ) {
			console.log("Request for " + pathname + " received.");
			route(handle, pathname, response, request);
		}
	}
	https.createServer(onRequest).listen(8888);

	console.log("Server has started.");
}

exports.start = start;