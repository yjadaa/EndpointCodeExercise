function responseMSG(response,writeHeadArgs,writeArgs)
{
	response.writeHead(writeHeadArgs[0], writeHeadArgs[1]);
	if( writeArgs.length > 1) {
		response.write(writeArgs[0],writeArgs[1]);
	} else {
		response.write(writeArgs[0]);
	}
	response.end();
}

function checkMissingPostArguments(POST,pathname)
{
    var returnFlag = false;
    var responseMessage = "";
    var checkOutputArray = new Array();
    switch(pathname)
    {
        case "/logIn":
            responseMessage += checkUserName(POST["username"]);
            responseMessage += checkPassword(POST["password"]);
            break;
    }
    if(responseMessage)
    {
        json = JSON.stringify({
            ERROR: 1,RESPONSE_FROM:pathname.substring(1),MSG: "Missing or Invalid Arguments:"  + responseMessage
        });
        returnFlag = json;
    }
    return returnFlag;
}

function checkUserName(username)
{
    var responseMessage = "";
    var pattern = /^[\w]*$/
    if(!username)
    {
        responseMessage +="|username| is missing, ";
    } else if (hasWhiteSpace(username))
    {
        responseMessage +="|username| has white space, ";
    } else if (isFinite(username))
    {
        responseMessage +="|username| can NOT be a number only, ";
    } else if (username.length < 3)
    {
        responseMessage +="|username| should be more than 2 characters, ";
    } else if (username.length >= 35)
    {
        responseMessage +="|username| should be less than 35 characters, ";
    } else if (!username.match(pattern))
    {
        responseMessage +="|username| can only contain alphanumeric characters from the basic Latin alphabet including the underscore, ";
    }

    return responseMessage;
}

function checkPassword(password)
{
    var responseMessage = "";
    if(!password)
    {
        responseMessage +="|password| is missing, ";
    } else if (hasWhiteSpace(password))
    {
        responseMessage +="|password| has white space, ";
    } else if (isFinite(password))
    {
       responseMessage +="|password| can NOT be a number only, ";
    } else if (password.length <3)
    {
        responseMessage +="|password| should be more than 2 characters, ";
    } else if (password.length >= 45)
    {
        responseMessage +="|password| should be less than 45 characters, ";
    }
    return responseMessage;

}

function hasWhiteSpace(s) {
  return /\s/g.test(s);
}

exports.responseMSG = responseMSG;
exports.checkMissingPostArguments = checkMissingPostArguments;


