
var app = angular.module("myApp", []);


app.controller("showHideCtrl", function($scope,$http) {
    function checkStatus()
    {
        $scope.nodeJsStatus = "Checking Status...";
        $scope.MySQLStatus = "Checking Status...";
        $scope.logIn = true;
        $scope.users = true;
        $scope.status = false;
        $scope.listFilesDir = true;
        $scope.logInDisabled = true;
        $scope.usersDisabled = true;
        $scope.statusDisabled = true;
        $scope.listFilesDirDisabled = true;
        $scope.method = 'GET';
        $scope.url = 'http://localhost:8888/';
        $http({method: $scope.method, url: $scope.url})
        .success(function(response) {
            $scope.logInDisabled = false;
            $scope.usersDisabled = false;
            $scope.listFilesDirDisabled = false;
            $scope.nodeJsStatus = "Node.js is up and working on http://localhost:8888/";
            $http({method: 'GET', url: 'http://localhost:8888/checkDbStatus'})
            .success(function(response) {
                if(response.ERROR == 10)
                {
                    $scope.MySQLStatus = "MySQL is OFF";        
                } else {
                    $scope.MySQLStatus = "MySQL is ON";      
                }
            });
        })
        .error(function(errorResponse) {
            $scope.nodeJsStatus = "Node.js is NOT working on http://localhost:8888/";
            $scope.MySQLStatus = "Node.js is NOT working so can't tell if MySQL is up or not";
        }); 
        var currentdate = new Date(); 
        var datetime = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
        $scope.dateTimeChecked = datetime;
    }
    $scope.statusToggle = function() {
        checkStatus();
    }
    $scope.checkStatus = function() {
        checkStatus();
    }
    $scope.logInToggle = function() {
        $scope.logIn = false;
        $scope.users = true;
        $scope.status = true;
        $scope.listFilesDir = true;
        $scope.logInDisabled = true;
    	$scope.usersDisabled = false;
        $scope.statusDisabled = false;
        $scope.listFilesDirDisabled = false;
    };
    $scope.usersToggle = function() {
        $scope.logIn = true;
        $scope.users = false;
        $scope.status = true;
        $scope.listFilesDir = true;
        $scope.logInDisabled = false;
    	$scope.usersDisabled = true;
        $scope.statusDisabled = false;
        $scope.listFilesDirDisabled = false;
    };
    $scope.listFilesDirToggle = function() {
        $scope.logIn = true;
        $scope.users = true;
        $scope.status = true;
        $scope.listFilesDir = false;
        $scope.logInDisabled = false;
        $scope.usersDisabled = false;
        $scope.statusDisabled = false;
        $scope.listFilesDirDisabled = true;
    };
    var init = function () {
        checkStatus();
    };
    init();
});

app.controller("logInResponseCtrl", function($scope,$http) {
	$scope.method = 'POST';
	$scope.url = 'http://localhost:8888/logIn';  
    $scope.keyDown = function() {
        $scope.isAuthenticated ="";
    };
    $scope.loadJSON = function() {
    	$scope.jsonData = "Fetching ...";
    	$scope.data = "";
    	for (var key in $scope.user) {
		    if ($scope.user.hasOwnProperty(key)) {
		    	$scope.data += key + "=" + $scope.user[key] + "&";
		    }
		}
        $http({method: $scope.method, url: $scope.url, data:$scope.data})
    	.success(function(response) {
            if (response.MSG == "Authenticated" || response.MSG == "NOT Authenticated" )
                $scope.isAuthenticated = response.MSG;
            else
                $scope.isAuthenticated = "Invalid Input, look at JSON response below for more details";
            $scope.jsonData = response;
        });
    };
});

app.controller("usersResponseCtrl", function($scope,$http) {
    $scope.method = 'GET';
    $scope.url = 'http://localhost:8888/users'; 
    $http({method: $scope.method, url: $scope.url})
    .success(function(response) {$scope.jsonData = response;})
    $scope.stateClicked = function(stateSelected) {
        if(stateSelected) {
         $http({method: $scope.method, url: $scope.url, params:{state:stateSelected}})
          .success(function(response) {$scope.jsonData = response;})
        } else {
            $http({method: $scope.method, url: $scope.url})
          .success(function(response) {$scope.jsonData = response;})
        } 
    };  
    
});

app.controller("listFilesDirResponseCtrl", function($scope,$http) {
    $scope.method = 'GET';
    $scope.url = 'http://localhost:8888/listFilesDir';  
    $scope.loadJSON = function() {
        $scope.jsonData = "Fetching ...";
        $http({method: $scope.method, url: $scope.url, params:{dir:$scope.dir}})
        .success(function(response) {$scope.jsonData = response;})
    };
});
