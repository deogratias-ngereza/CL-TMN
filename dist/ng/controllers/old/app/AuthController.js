
APP.controller('AuthController', ['$scope','$state','AuthService','CookieManagerService','GServices','GDumpService',
 function($scope,$state,AuthService,CookieManagerService,GServices,GDumpService) {

 	GDumpService.log(0, -1,"AuthController");
 	$scope.IS_LOADING = false;
 	$scope.LOADING_MSG = "loading ..";
 	$scope.USER_OBJ = {
 		//email : 'admin@gmail.com',password:'password',phone : '0688059688'
        account_no : '',password:''
 	};


 	/**
     * HIDE AND SHOW LOADING STATUS
     */
    //show and hide loading
    $scope.change_loading_status = function(status,msg){
        if(status == true){
            $scope.IS_LOADING = true;
            $scope.LOADING_MSG = msg;
        }else{
            $scope.IS_LOADING = false;   
        }
    };



 	/*
	LOGIN
 	*/
    $scope.login = function(){
    	$scope.change_loading_status(true,"signing in ..");
        //var conn = AuthService.postLogin($scope.USER_OBJ );
        var conn = AuthService.postLoginByAccount($scope.USER_OBJ );
        conn.then(
            function(response){
                $scope.IS_LOADING = false;
                if(response.status == 200 || 201 || 202 || 203 || 204){
                    GDumpService.log(0, -1,response);
                    $scope.change_loading_status(true,"login success.");

                    //save the user object and token
                    AuthService.saveCurrentUser(response.data.msg_data.user);
                    AuthService.saveCurrentWebToken(response.data.msg_data.token);

                    CookieManagerService.saveCompanyInfo(response.data.msg_data.company);

                    if(AuthService.getCurrentWebToken() == undefined || AuthService.getCurrentWebToken() == null){
                    	$scope.change_loading_status(true,"Sorry user cannot be solved!!");
                    }else{
                    	
                        //$scope.get_single_center_info();
                        $state.go('app');
                    }
                }else{
                    //$scope.change_loading_status(true,response.data.msg_data);
                    //$scope.change_loading_status(true,response.status);
                    $scope.change_loading_status(true,"invalid credentials!!");
                }
            },
            function(error){
                GDumpService.log(0, -1,error);
            	//$scope.change_loading_status(true,"Sorry there is an error!!");
                $scope.change_loading_status(true,error.data.msg_data);
            }
        );
    };


    var init = function(){
        //prevent to see login view 
        var userOBJ = AuthService.getCurrentUser();
        if(userOBJ != undefined){
            $state.go('app');
        }
    };

    init();






}]);