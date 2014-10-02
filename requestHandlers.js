var utilities = require("./utilities");
var MySQLHandlers = require("./MySQLHandlers");
var qs = require("querystring");
var url = require("url");
var fs = require("fs");

//Test Function to make sure server is working fine
function start(response) {
	console.log("Request handler 'start' was called.");
	var body = '<!Doctype html>' + '<html>'+
	'<head>'+
	'<meta http-equiv="Content-Type" '+
	'content="text/html; charset=UTF-8" />'+
	'</head>'+
	'<body>'+
	'<b> Server is Working</b>'+
	'</body>'+
	'</html>';
	response.writeHead(200, {"Content-Type": "text/HTML"});
	response.write(body);
	response.end();
}

function logIn(response,request,pathname) {
	if (request.method == 'POST') {
		var body = '';
		request.on('data', function (data) {
			body += data;
		});
		request.on('end', function () {
			var POST = qs.parse(body);
			// use POST
			var returnOutput = utilities.checkMissingPostArguments(POST,pathname);
			if( returnOutput === false)
			{
				var username = POST["username"];
				var password = POST["password"];
				var extraDataObject = { pathname: pathname};
				MySQLHandlers.selectMySQL(response,extraDataObject,['USER_ID'],['USERS'],{'USER_USERNAME':username,'USER_PASSWORD':password});
			}
			else
			{
				utilities.responseMSG(response,[200, {"Content-Type": "application/json"}],[returnOutput]);
			}
		});
	} else {
		var json = JSON.stringify({ERROR:1,RESPONSE_FROM: pathname.substring(1), MSG:"Not a POST request"});
		utilities.responseMSG(response,[200, {"Content-Type": "application/json"}],[json]);
	}
}

function users(response,request,pathname) {
	if (request.method == 'GET') {
			var url_parts = url.parse(request.url, true);
			var GET = url_parts.query;
			// use GET
			var state = GET["state"];
			var extraDataObject = { pathname: pathname};
			if(state)
			{
				MySQLHandlers.selectMySQL(response,extraDataObject,['USER_FIRSTNAME','USER_LASTNAME','USER_STATE','USER_GENDER'],['USERS'],{'USER_STATE':state});
			} else {
				MySQLHandlers.selectMySQL(response,extraDataObject,['USER_FIRSTNAME','USER_LASTNAME','USER_STATE','USER_GENDER'],['USERS']);
			}
	} else {
		var json = JSON.stringify({ERROR:1,RESPONSE_FROM: pathname.substring(1), MSG:"Not a GET request"});
		utilities.responseMSG(response,[200, {"Content-Type": "application/json"}],[json]);
	}
}

function checkDbStatus(response,request,pathname) {
	if (request.method == 'GET') {
			var extraDataObject = { pathname: pathname};
			MySQLHandlers.selectMySQL(response,extraDataObject,['DUMMY'],['USERS'],{'USER_STATE':'DUMMY'});
	} else {
		var json = JSON.stringify({ERROR:1,RESPONSE_FROM: pathname.substring(1), MSG:"Not a GET request"});
		utilities.responseMSG(response,[200, {"Content-Type": "application/json"}],[json]);
	}
}

function listFilesDir(response,request,pathname) {
	var json;
	if (request.method == 'GET') {
			var url_parts = url.parse(request.url, true);
			var GET = url_parts.query;
			// use GET
			var dir = GET["dir"];
			if(!dir)
			{
				dir = __dirname; //current directory 
			}
			fs.readdir(dir, function (err, files) { 
				if (!err) {
					json = JSON.stringify({Directory:dir,List_Files:files}); 
				    utilities.responseMSG(response,[200, {"Content-Type": "application/json"}],[json]);
				} else {
					json = JSON.stringify({ERROR:1,RESPONSE_FROM: pathname.substring(1), MSG:err}); 
				    utilities.responseMSG(response,[200, {"Content-Type": "application/json"}],[json]);
				}
			});
	} else {
		json = JSON.stringify({ERROR:1,RESPONSE_FROM: pathname.substring(1), MSG:"Not a GET request"});
		utilities.responseMSG(response,[200, {"Content-Type": "application/json"}],[json]);
	}
	
}


exports.start = start;
exports.logIn = logIn;
exports.users = users;
exports.checkDbStatus = checkDbStatus;
exports.listFilesDir = listFilesDir;
