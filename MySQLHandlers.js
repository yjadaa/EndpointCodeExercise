var mysql = require('mysql');
var utilities = require("./utilities");

var db_config = {
    host     : 'localhost',
	user     : 'testDbUser',
	password : 'test123456',
    database : 'test',
    dateStrings : true //Force date types to be returned as strings rather then inflated into JavaScript Date objects.
};

var handle = {};
handle["logIn"] = logInRoute;
handle["users"] = usersRoute;
handle["checkDbStatus"] = checkDbStatusRoute;

function creatPoolDBConnection(response,extraDataObject,SQLQuery,inserts) {
	var pool  = mysql.createPool(db_config);
	var json= "";
	pool.getConnection(function(err, connection) {
		if(err) {
			json = JSON.stringify({ERROR:10,RESPONSE_FROM: extraDataObject.pathname.substring(1),MSG: "Error when creating a pool and connecting to db:" + err});
			utilities.responseMSG(response,[200, {"Content-Type": "application/json"}],[json]);
		} else {
			var query = connection.query( SQLQuery,inserts, function(err, rows) {
				extraDataObject.errorWithResponse = 0;
				if(err) {
					errorQueryingSQLRoute(response,extraDataObject,err);	
				} 
				if (extraDataObject.errorWithResponse === 0) { //If there was an error with a response then dont process
					var rowObjects = {};
					var rowsArray = new Array();
					for(var i=0;i<rows.length;i++) {
						var row = rows[i];
						for (result in row)
						{
							if (result !== "parse" && result !== "_typeCast") {
								 rowObjects[result] = row[result];
							}
						}
						rowsArray.push(rowObjects);
						rowObjects = {};
					}
					extraDataObject.rowsArray = rowsArray;
					extraDataObject.rows = rows;

					if (typeof handle[extraDataObject.pathname.substring(1)] === 'function') {
						handle[extraDataObject.pathname.substring(1)](response,extraDataObject);
					} else {
						handle["default"](response,extraDataObject);
					}
				}
				connection.destroy();
				// Don't use the connection here, it has been returned to the pool.
			});
			console.log(query.sql);
		}
	});
}

/*selectMySQL function
response: json response to the user
extraDataObject: any extra data that are needed, passed as an object
Columns: Columns that will be selected, passed as an array
TableName: Targeted db's table to be updated, passed as an array
WhereStatements: Where Conditions that should be considered, passed as an object
Example ==> MySQLHandlers.selectMySQL(response,extraDataObject,['COLUMN_1','COLUMN_2','COLUMN_3'],['TABLE'],{'COLUMN_2':'VALUE1','COLUMN_1':'VALUE2'});
*/
function selectMySQL(response,extraDataObject,Columns,TableName,WhereStatements)
{
	var select = "";
	for (var i=0;i<Columns.length;i++)
	{
		if ( i === 0 ) {
			select = Columns[i];
		} else {
			select += "," + Columns[i];
		}
	}
	var sql = "SELECT " + select;
	sql += " from ?? ";
	var inserts = new Array();
	inserts.push(TableName);
	if (WhereStatements)
	{
		var Where = "";
		var firstWhere = true;
		for (WhereStatement in WhereStatements)
		{
			if ( firstWhere === true ) {
				Where = WhereStatement + "=" + "'" + WhereStatements[WhereStatement] + "'";
				firstWhere = false;
			} else {
				Where += " AND " + WhereStatement + "=" + "'" + WhereStatements[WhereStatement] + "'";
			}
			
		}
		sql += "WHERE " + Where;
	}
	creatPoolDBConnection(response,extraDataObject,sql,inserts);
}


function logInRoute(response,extraDataObject) {
	if (extraDataObject.rowsArray.length == 0 ) 
	{
		extraDataObject = {ERROR:0, RESPONSE_FROM : extraDataObject.pathname.substring(1), MSG : "NOT Authenticated"};	
	} else 
	{
		extraDataObject = {ERROR:0, RESPONSE_FROM : extraDataObject.pathname.substring(1), MSG : "Authenticated"};
		
	}
	var json = JSON.stringify(extraDataObject);
	utilities.responseMSG(response,[200, {"Content-Type": "application/json"}],[json]);	
}

function usersRoute(response,extraDataObject) {
	extraDataObject = {ERROR:0, RESPONSE_FROM : extraDataObject.pathname.substring(1), USERS : extraDataObject.rowsArray};
	var json = JSON.stringify(extraDataObject);
	utilities.responseMSG(response,[200, {"Content-Type": "application/json"}],[json]);	
}

function checkDbStatusRoute(response,extraDataObject) {
	extraDataObject = {ERROR:0, RESPONSE_FROM : extraDataObject.pathname.substring(1), MSG : "On"};
	var json = JSON.stringify(extraDataObject);
	utilities.responseMSG(response,[200, {"Content-Type": "application/json"}],[json]);	
}




function errorQueryingSQLRoute(response,extraDataObject,err) {
	extraDataObject.errorWithResponse = 1;
	var json = JSON.stringify({ERROR:1,RESPONSE_FROM: extraDataObject.pathname.substring(1), MSG:"Error when querying SQL statement:" + err});
	utilities.responseMSG(response,[200, {"Content-Type": "application/json"}],[json]);
}

exports.selectMySQL = selectMySQL;