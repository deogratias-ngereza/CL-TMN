APP.controller('DashboardController', ['$timeout','$scope','$state','AuthService','BASE_SERVER_URL','CookieManagerService','GServices','HelperService','GDumpService',
 function($timeout,$scope,$state,AuthService,BASE_SERVER_URL,CookieManagerService,GServices,HelperService,GDumpService) {


    $scope.TODAYS_DATE = HelperService.getCurrentDate('yyyy-mm-dd');

    $scope.FILTER_OPTION = {
        start_date : $scope.TODAYS_DATE,
        end_date : $scope.TODAYS_DATE,
        vendor_id: -1,
        lh_value : 'ALL',
        bill_to:'A'
    };

    $scope.applyGeneralFilter = function(){
        CookieManagerService.saveGeneralFilters($scope.FILTER_OPTION);
        alert("FILTER SAVED.");
    };





    


    $scope.get_vendors = function(){
        var conn = GServices.get_vendors();
        conn.then(
            function(response){
                $scope.IS_LOADING = false;
                if(response.status == 200 || 201 || 202 || 203 || 204){
                    $scope.VENDORS_LIST = response.data.msg_data;//response.data;
                    $scope.VENDORS_LIST.push({id:-1,name:'ALL'});
                    //console.log("F::" + JSON.stringify(CookieManagerService.getGeneralFilters()));

                    //apply filters
                    var oldFilters = CookieManagerService.getGeneralFilters();
                    if(oldFilters == undefined){
                        CookieManagerService.saveGeneralFilters($scope.FILTER_OPTION);
                    }else{
                        $scope.FILTER_OPTION = oldFilters;
                        $scope.$parent.FILTER_OPTION = oldFilters;
                    }
                }else{
                }
            },
            function(error){
            }
        );
    };

    var init = function(){
        $scope.get_vendors();
    };
    init();

}]);