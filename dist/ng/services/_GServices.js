/**
 * #grand123grand1@gmail
 * EASY LOGGING ON BROWSER
 * set from constrants
 */
APP.factory("GDumpService", ["$rootScope", "APP_LOGGING",
    function($rootScope, APP_LOGGING) {

        var OBJ = {};
        OBJ.test = function() {
            console.log("test_ function");
        };

        OBJ.log = function(option, status, msg) {
            //options 0  and 1 0 -> default, 1 -> individual
            if (option == 1) {
                console.log(msg);
            } else {
                //check global options
                if (APP_LOGGING == true) {
                    console.log(msg);
                }
            }

        };
        return OBJ;
    }
]);

/**
 * #grand123grand1@gmail.APP
 * LOGIN/COOKIEs & USER MANAGEMENT
 */

APP.factory("AuthService",["$rootScope","$http","BASE_URL","$cookies","$location","$window",
function($rootScope,$http,BASE_URL,$cookies,$location,$window){

    var OBJ = {};
    var now = new Date();
    var expiresValue = new Date(now);//for cookies

    var expTimeOne = expiresValue.setSeconds(now.getSeconds() + 86400); //in 24 hrs
    var expTimeTwo = expiresValue.setSeconds(now.getSeconds() + 604800); //in 1week

    OBJ.test = function(){
        console.log("test_ function");
    };

    //post login
    OBJ.postLogin = function(_data){
        //return $http.post(BASE_URL + "api-v1/login",_data);
        return $http({
            url     : BASE_URL + "api-v1/login",
            method  : 'POST',
            data    : _data, 
            headers : {'Content-Type': 'application/json'},
            withCredentials: true
        });
    };
    //retrieve user from cookie
    OBJ.getCurrentUser = function(){
        return $cookies.getObject("APP_CUR_USER");
    };
    //save user to the cookie
    OBJ.saveCurrentUser = function(data){
        $cookies.putObject("APP_CUR_USER",data,{ 'expires.toUTCString': expTimeTwo });
		console.log("USER SAVED:",$cookies.getObject("APP_CUR_USER"));
    };
    //save web token to the cookie
    OBJ.saveCurrentWebToken = function(data){
        $cookies.putObject("APP_WEB_TOKEN",data,{ 'expires.toUTCString': expTimeTwo });
        //$http.defaults.headers.APPmon.Authorization = 'Bearer ' + data;//http://jasonwatmore.APP/post/2016/04/05/angularjs-jwt-authentication-example-tutorial
		console.log("WEB TOKEN SAVED:",$cookies.getObject("APP_WEB_TOKEN"));
    };
    //get web token to the cookie
    OBJ.getCurrentWebToken = function(){
        return $cookies.getObject("APP_WEB_TOKEN");
    };
    //logout the user..
    OBJ.logout = function(){
        $cookies.remove("APP_WEB_TOKEN");
        $cookies.remove("APP_CUR_USER");
    };
    //redirect to the login page
    OBJ.goToLoginPage = function(){
        $window.location.href = BASE_URL;
    };



    //this can be modified by user thats y we keep on checking it..
    OBJ.getBaseURLOfCurrentViewingPage = function(){
        var url = $location.absUrl().split('?')[0];
        var arr = url.split('#');
        return arr[0];
    };

  
    //retrieve CSRF token from server..
    OBJ.goFindCSRFToken = function (){
        return $http.get(BASE_URL + "api-v1/get_free_token/");
    };


  
    //save token to the cookie
    OBJ.saveCurrentToken = function(data){
        $cookies.putObject("APP_TOKEN",data,{ 'expires.toUTCString': expTimeTwo });
		console.log("TOKEN SAVED:",$cookies.getObject("APP_TOKEN"));
    };
    //get token to the cookie
    OBJ.getCurrentToken = function(){
        return $cookies.getObject("APP_TOKEN");
    };

    
    //redirect to the login page
    OBJ.goToLoginPage = function(){
        $window.location.href = BASE_URL;
    };



    //get access to the current user api
    OBJ.getCurrentUserAPI = function(){
        return $http.get(BASE_URL + "api-v1/get_profile/" + OBJ.getCurrentUser().id);
    };


    return OBJ;
}]);













/**
 * ALL API MATCHING ROUTES
 */
APP.factory("GServices", ["$rootScope", "$http", "APP_LOGGING", "BASE_SERVER_URL",
    function($rootScope, $http, APP_LOGGING, BASE_SERVER_URL) {

        var OBJ = {};


        
        //list of activities
        OBJ.get_activities = function() {  return $http.get(BASE_SERVER_URL + 'api-v1/activitiess', { cache: false });  };
        //find activities from id
        OBJ.get_single_activities = function(data) {  return $http.get(BASE_SERVER_URL + 'api-v1/activities/' + data.id, { cache: false });  };
        //delete activities
        OBJ.post_activities_delete = function(data) { return $http.post(BASE_SERVER_URL + 'api-v1/activities_delete', {id:data.id});  };
        //insert activities
        OBJ.post_activities_insert = function(data) { return $http.post(BASE_SERVER_URL + 'api-v1/activities_insert/', data);  };
        //update activities
        OBJ.post_activities_update = function(data) {  return $http.post(BASE_SERVER_URL + 'api-v1/activities_update/', data);  };
        //delete activities
        OBJ.get_activities_search = function(data) {  return $http.get(BASE_SERVER_URL + 'api-v1/activities_search?key=' + data.key, { cache: true });  };
        
        



        return OBJ;
    }
]);




/**
 * XLS SERVICES
 */
/*
APP.factory("GXLSService",["$rootScope",
function($rootScope){
    var OBJ = {};
    OBJ.test = function(obj){
        alasql("CREATE TABLE cities (city string, population number)");
        alasql("INSERT INTO cities VALUES ('Rome',2863223),('Paris',2249975),('Berlin',3517424),('Madrid',3041579)");
        var res = alasql("SELECT * FROM cities");
        alasql('SELECT * INTO XLSX("<table_name>.xlsx",{headers:true}) FROM ?',[res]);
    };
   //overview function..
   OBJ.getExcelAPPOverview = function(xlsName,obj){
        alasql("CREATE TABLE <table_name> (id string, sale number, APPmission_value number)");
        //alasql("INSERT INTO <table_name> VALUES ('0',1000,0.2)");
        var services = obj.services;
        for(sev in services){
            console.log(sev);
            var cur_service = services[sev];
            var no_of_trans = Object.keys(cur_service).length;
            for(i = 0; i < no_of_trans;i++){
                alasql("INSERT INTO <table_name> VALUES (" + cur_service[i].ID + "," + cur_service[i].SALE + "," + cur_service[i].APPMISSION + ")");
            }
        }
        var res = alasql("SELECT * FROM <table_name>");
        alasql('SELECT * INTO XLSX("<table_name>.xlsx",{headers:true}) FROM ?',[res]);
        //console.log(res);
    };

    return OBJ;
}]);
*/






