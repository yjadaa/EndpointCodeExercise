var utilities = require("./utilities");

function route(handle, pathname,response, request) {
	console.log("About to route a request for " + pathname);
	if (typeof handle[pathname] === 'function') {
		return handle[pathname](response,request,pathname);
	} else {
		console.log("No request handler found for " + pathname);
		var json = JSON.stringify({
                    ERROR: 1,RESPONSE_FROM:"invalidPage",MSG: "No request handler found for '" + pathname + "' 404 Not found"
                    });
		utilities.responseMSG(response,[200, {"Content-Type": "application/json"}],[json]);
	} 
}

exports.route = route;