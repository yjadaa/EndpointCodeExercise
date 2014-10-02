var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");
var utilities = require("./utilities");

var handle = {};
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/logIn"] = requestHandlers.logIn;
handle["/users"] = requestHandlers.users;
handle["/checkDbStatus"] = requestHandlers.checkDbStatus;
handle["/listFilesDir"] = requestHandlers.listFilesDir;
server.start(router.route, handle);
