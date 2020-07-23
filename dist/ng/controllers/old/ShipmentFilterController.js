APP.controller('ShipmentFilterController', ['$timeout','$window','$stateParams','$scope','$state','APP_CONST','AuthService','BASE_SERVER_URL','CookieManagerService','GServices','HelperService','GDumpService',
 function($timeout,$window,$stateParams,$scope,$state,APP_CONST,AuthService,BASE_SERVER_URL,CookieManagerService,GServices,HelperService,GDumpService) {


 	GDumpService.log(0, -1,"ShipmentFilterController");
    $scope.IS_LOADING = false;
    $scope.LOADING_MSG = "Loading ...";
    $scope.SEARCH_OBJ = { 
    	vendor_id : parseInt($stateParams.vendor_id),
    	search_key : "",
    	start_date : $stateParams.start_date,
    	end_date:$stateParams.end_date,
    	lh_value:"ALL",
    	//scan_type : "ALL",
    	//ro_generated : -1,//all,
    	bill_to : 'A',
    	category:$stateParams.category,
    	arrived_status : 'ALL',
    	awb_cust_defined : 'ALL',
    	email_status : 'ALL' //SENT,ERROR,SCHEDULLED,NOT_SENT
    };
    $scope.SYS_BUNDLES = {};
    $scope.PAYABLE_SERVICES = [];

    $scope.CURRENT_USER = $scope.$parent.CURRENT_USER;
    $scope.COMPANY_INFO = $scope.$parent.COMPANY_INFO;
    $scope.SHIPMENTS = [];
    $scope.VENDORS_LIST = [];//CookieManagerService.getClientsList();
    

    $scope.filter_shipments = function(){
        //var conn = GServices.filter_shipments(($stateParams.category).toLowerCase(),$scope.SEARCH_OBJ);
        var conn = GServices.filter_declared_shipments($scope.SEARCH_OBJ);
        conn.then(
            function(response){
                $scope.IS_LOADING = false;
                if(response.status == 200 || 201 || 202 || 203 || 204){
                    $scope.SHIPMENTS = response.data.msg_data;//response.data;
                }else{
                }
            },
            function(error){
            }
        );
    };
    $scope.download_filtered_shipments = function(){
        var conn = GServices.download_filtered_shipments(($stateParams.category).toLowerCase(),$scope.SEARCH_OBJ);
        conn.then(
            function(response){
                $scope.IS_LOADING = false;
                if(response.status == 200 || 201 || 202 || 203 || 204){
                    //$scope.SHIPMENTS = response.data//.msg_data;//response.data;
                    $window.open(APP_CONST.REPORT_XLS_SERVER_BASE_URL + '?fn='+ response.data.xls_fn, '_blank');
                }else{
                }
            },
            function(error){
            }
        );
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
    //
    $scope.SHOW_SIDEVIEW = 1;
    $scope.toggleSideView = function(){
    	$scope.SHOW_SIDEVIEW = $scope.SHOW_SIDEVIEW == 1? 0: 1; 
    };
    $scope.getPayableServiceCodeFromId = function(serviceId){
        $code = "";
        for(i =0;i < $scope.PAYABLE_SERVICES.length;i++){
            if($scope.PAYABLE_SERVICES[i].id == serviceId){
                $code = $scope.PAYABLE_SERVICES[i].code;
            }
        }
        return $code;
    };

    $scope.get_vendors = function(){ 
        var conn = GServices.get_vendors(); 
        conn.then(
            function(response){
                $scope.IS_LOADING = false;
                if(response.status == 200 || 201 || 202 || 203 || 204){
                    $scope.VENDORS_LIST = response.data.msg_data;//response.data;
                	$scope.VENDORS_LIST.push({id:-1,name:'ALL'});
                	//alert($scope.SEARCH_OBJ.vendor_id);
                	$scope.SEARCH_OBJ.vendor_id = parseInt($stateParams.vendor_id);
                	$scope.filter_shipments();
                }else{
                }
            },
            function(error){
            }
        );
    };
    $scope.get_sys_bundles = function(){
        var conn = GServices.get_payment_receipt_bundles();
        conn.then(
            function(response){
                $scope.IS_LOADING = false;
                if(response.status == 200 || 201 || 202 || 203 || 204){
                    $scope.SYS_BUNDLES = response.data.msg_data;//response.data;
                    $scope.PAYABLE_SERVICES = response.data.msg_data.payable_services;
                    //$scope.RECEIPT_DATA.currency = $scope.SYS_BUNDLES.currency_code;

                    /*FILTER*/
                    $scope.filter_shipments();
                    
                    

                }else{
                }
            },
            function(error){
            }
        );
    };


		

	var init = function(){ 
		$scope.get_sys_bundles();
	};
	init();

}]);