APP.controller('MainAppController', ['$scope','$state','AuthService','BASE_SERVER_URL','CookieManagerService','GServices','HelperService','GDumpService',
 function($scope,$state,AuthService,BASE_SERVER_URL,CookieManagerService,GServices,HelperService,GDumpService) {


 	$scope.SHOW_TOP_BAR = 0;

    $scope.TODAYS_DATE = HelperService.getCurrentDate('yyyy-mm-dd');

 	$scope.CURRENT_USER = AuthService.getCurrentUser(); 
    $scope.COMPANY_INFO = CookieManagerService.getCompanyInfo();
    //$scope.DEPARTMENT_INFO = CookieManagerService.getDepartmentInfo();

    //$scope.USER_ROLE = $scope.CURRENT_USER.role;

    $scope.SERVER_URL = BASE_SERVER_URL;
    $scope.VENDORS_LIST = [];
    $scope.BRANCHES = [];

    $scope.FILTER_OPTION = {
        start_date : $scope.TODAYS_DATE,
        end_date : $scope.TODAYS_DATE,
        vendor_id: -1,
        lh_value : 'ALL',
        bill_to:'A'
    };

    $scope.logout = function(){
    	AuthService.logout();
    	$state.go("login");
    };

    $scope.show_top_bar = function(status){
    	$scope.SHOW_TOP_BAR = status;
    };

    
    $scope.get_vendors = function(){ 
        var conn = GServices.get_vendors(); 
        conn.then(
            function(response){
                $scope.IS_LOADING = false;
                if(response.status == 200 || 201 || 202 || 203 || 204){
                    $scope.VENDORS_LIST = response.data.msg_data;//response.data;
                    $scope.get_branches();
                }else{
                }
            },
            function(error){
            }
        );
    };
    $scope.get_branches = function(){ 
        var conn = GServices.get_branches(); 
        conn.then(
            function(response){
                $scope.IS_LOADING = false;
                if(response.status == 200 || 201 || 202 || 203 || 204){
                    $scope.BRANCHES = response.data.msg_data;//response.data;
                    $scope.BRANCHES.push({id:-1,name:'ALL'});
                }else{
                }
            },
            function(error){
            }
        );
    };

    /*AC*/
    $scope.ACS_LIST = CookieManagerService.getACInfo() == undefined ? []: CookieManagerService.getACInfo();
    $scope.AC_ENTRANCE_ACCESS_CODE = "_ACFIN"; 
    $scope.ACV = function($access){//access controll validator
        if($scope.CURRENT_USER.is_developer == 1) return true;//auto grant access
        var access_granted = false;
        for(var i = 0; i < $scope.ACS_LIST.length;i++){
            if($scope.ACS_LIST[i].code == $access){
                access_granted = true;
                break;
            }
        }
        return access_granted;
    };



    //
    var init = function(){
        console.log("[ MainAppController ]");
       // console.log(JSON.stringify($scope.CURRENT_USER));
       var access_granted = $scope.ACV($scope.AC_ENTRANCE_ACCESS_CODE);
       if(!access_granted){
            if($scope.CURRENT_USER.is_developer == 1) return true;//auto grant access
            alert("ACCESS DENIED\nINVALID ACCESS TO A GIVEN MODULE!!!");
            AuthService.logout();
            $state.go("login");
       }else{
            //console.log("ACCESS GRANTED");
            $scope.get_vendors();
            console.log("[ MainAppController ]");
       }
    };



    init();


}]);