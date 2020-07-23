


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
        //return $http.post(BASE_URL + "api/auth/login",_data);
        return $http({
            url     : BASE_URL + "api/auth/login",
            method  : 'POST',
            data    : _data, 
            headers : {'Content-Type': 'application/json'},
            withCredentials: true
        });
    };
    //retrieve user from cookie
    OBJ.getCurrentUser = function(){
        return $cookies.getObject("COM_CUR_USER");
    };
    //save user to the cookie
    OBJ.saveCurrentUser = function(data){
        $cookies.putObject("COM_CUR_USER",data,{ 'expires.toUTCString': expTimeTwo });
		console.log("USER SAVED:",$cookies.getObject("COM_CUR_USER"));
    };
    //save web token to the cookie
    OBJ.saveCurrentWebToken = function(data){
        $cookies.putObject("COM_WEB_TOKEN",data,{ 'expires.toUTCString': expTimeTwo });
        //$http.defaults.headers.common.Authorization = 'Bearer ' + data;//http://jasonwatmore.com/post/2016/04/05/angularjs-jwt-authentication-example-tutorial
		console.log("WEB TOKEN SAVED:",$cookies.getObject("COM_WEB_TOKEN"));
    };
    //get web token to the cookie
    OBJ.getCurrentWebToken = function(){
        return $cookies.getObject("COM_WEB_TOKEN");
    };
    //logout the user..
    OBJ.logout = function(){
        $cookies.remove("COM_WEB_TOKEN");
        $cookies.remove("COM_CUR_USER");
    };
    //redirect to the login page
    OBJ.goToLoginPage = function(){
        $window.location.href = BASE_URL;
    };





























































































    //get valid base url for logged in users eg http://localhost:8000/doctor
    OBJ.getValidBaseURLForThisUser = function(){
        return BASE_URL + OBJ.getDepartmentName(OBJ.getCurrentUser().department_id);
    };
    //this can be modified by user thats y we keep on checking it..
    OBJ.getBaseURLOfCurrentViewingPage = function(){
        var url = $location.absUrl().split('?')[0];
        var arr = url.split('#');
        return arr[0];
    };

  
    /**
     *  1) capture current url and split to get base 
     *  2) then check if ID matches with department..
     *  validate the user in valid department..(return true or false)
     */
    OBJ.isUserValidTothisDepartment = function(){
        var given_url = OBJ.getBaseURLOfCurrentViewingPage();
        var real_url = OBJ.getValidBaseURLForThisUser();
        return (given_url == real_url ? true : false);
    };

    //retrieve CSRF token from server..
    OBJ.goFindCSRFToken = function (){
        return $http.get(BASE_URL + "COM/get_free_token/");
    };


  
    //save token to the cookie
    OBJ.saveCurrentToken = function(data){
        $cookies.putObject("COM_TOKEN",data,{ 'expires.toUTCString': expTimeTwo });
		console.log("TOKEN SAVED:",$cookies.getObject("COM_TOKEN"));
    };
    //get token to the cookie
    OBJ.getCurrentToken = function(){
        return $cookies.getObject("COM_TOKEN");
    };
   

    //save patient to the cookie
    OBJ.saveCurrentPatient= function(data){
        $cookies.putObject("COM_CUR_PATIENT",data,{ 'expires.toUTCString': expTimeOne });
		console.log("PATIENT SAVED:",$cookies.getObject("COM_CUR_PATIENT"));
    };
    //retrieve patient from cookie
    OBJ.getCurrentPatient = function(){
        return $cookies.getObject("COM_CUR_PATIENT");
    };

    
    //redirect to the login page
    OBJ.goToLoginPage = function(){
        $window.location.href = BASE_URL;
    };



    //get access to the current user api
    OBJ.getCurrentUserAPI = function(){
        return $http.get(BASE_URL + "api/get_profile/" + OBJ.getCurrentUser().id);
    };


    return OBJ;
}]);

