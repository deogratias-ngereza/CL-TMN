APP.controller('SummaryController', ['$timeout','$scope','$state','AuthService','BASE_SERVER_URL','CookieManagerService','GServices','HelperService','GDumpService',
 function($timeout,$scope,$state,AuthService,BASE_SERVER_URL,CookieManagerService,GServices,HelperService,GDumpService) {


    $scope.TODAYS_DATE = HelperService.getCurrentDate('yyyy-mm-dd');

    $scope.FILTER_OPTION = {
        start_date : $scope.TODAYS_DATE,
        end_date : $scope.TODAYS_DATE,
    };
    $scope.SUMMARY = null;
    $scope.SELECTED_WORKER = null;
    $scope.HelperService = HelperService;

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

    $scope.selectThisWorker = function(obj){
    	$scope.SELECTED_WORKER = obj;
    };


    


    $scope.get_summary = function(){
    	$scope.change_loading_status(true,"Loading summary ...");
        var conn = GServices.get_summary();
        conn.then(
            function(response){
                $scope.IS_LOADING = false;
                if(response.status == 200 || 201 || 202 || 203 || 204){
                    $scope.SUMMARY = response.data.msg_data;//response.data;
                   
                }else{
                }
            },
            function(error){
            	alert("ERROR!!");
            }
        );
    };

    var init = function(){
        $scope.get_summary();
    };
    init();

}]);