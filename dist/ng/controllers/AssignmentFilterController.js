APP.controller('AssignmentFilterController', ['$timeout','$scope','$state','$stateParams','AuthService','BASE_SERVER_URL','CookieManagerService','GServices','HelperService','GDumpService',
 function($timeout,$scope,$state,$stateParams,AuthService,BASE_SERVER_URL,CookieManagerService,GServices,HelperService,GDumpService) {

 	$scope.IS_LOADING = true;
    $scope.LOADING_MSG = "";
    $scope.TODAYS_DATE = HelperService.getCurrentDate('yyyy-mm-dd');

    $scope.HelperService = HelperService;

    $scope.CURRENT_USER = $scope.$parent.CURRENT_USER;
    $scope.COMPANY_INFO = $scope.$parent.COMPANY_INFO;
    $scope.TASK_UPDATE_DURATIONS = [ 
        {code:'-- ALL --',hrs:0},{code:'6 Hrs',hrs:6},
        {code:'12 Hrs',hrs:12}, {code:'24 Hrs',hrs:24},{code:'48 Hrs',hrs:48},
        {code:'72 Hrs',hrs:72},{code:'1 week',hrs:168},{code:'2 week',hrs:336},
        {code:'1 Month',hrs:672},{code:'3 Month',hrs:2016},{code:'6 Month',hrs:4032},
        {code:'1 Year',hrs:8064},
    ];

    $scope.FILTER_OPTION = {
        filter_category:'DATE',
        vendor_id:-1,
        start_date : $stateParams.start_date,
        end_date : $stateParams.end_date,

        user_id : parseInt($stateParams.user_id),
        category : $stateParams.category,
        assigned_status : parseInt($stateParams.assigned_status),
        username : $stateParams.username,
        lh_value : 'ALL',
        bill_to : 'A',
        cs_id : -1,//$scope.CURRENT_USER.id,
        worker_opt : 'CS',

        shipment_type : 'M',

        ro_status : 'ALL',
        released_status:'AT-CUSTOMS',
        search_key:'',
        verified_status : 'VERIFIED',
        clearing_opt:'ALL',

        untouched_hrs : 0
       
    };
    
    console.log("[ AssignmentFilterController ]")

    $scope.getAllSelectedShipments = function($option){
        var list = [];
        var awbsWithIdsOnly = [];
        for($i = 0; $i < $scope.SHIPMENTS.length;$i++){
            if($scope.SHIPMENTS[$i].is_checked){
                //awbsWithIdsOnly.push($scope.SHIPMENTS[$i]);
                /*list.push({
                    id : $scope.SHIPMENTS[$i].id,
                    awb:$scope.SHIPMENTS[$i].awb_no
                });
                */
                awbsWithIdsOnly.push($scope.SHIPMENTS[$i].id);
                list.push($scope.SHIPMENTS[$i]);
            }
        }
        if($option == "IDS"){
            return awbsWithIdsOnly;
        }else{
            return list;
        }
        //return $option == null ? list : awbsWithIdsOnly;
    };

    $scope.applyGeneralFilter = function(){
        CookieManagerService.saveGeneralFilters($scope.FILTER_OPTION);
        alert("FILTER SAVED.");
    };

    //assignCourierForPickupModal
    $scope.openAssignWorkerModal = function(obj){
        $scope.PICKED_OBJ = obj;
        jQuery("#assignWorkerModal").modal();
    };
    $scope.prepareThisWorker2BeAssigned = function(workerObj){
        $scope.CURRENT_SELECTED_WORKER = workerObj;
    };
    $scope.confirmAssignment = function(){
        jQuery("#assignWorkerModal").modal('toggle');

        var mydata = {
            group:'CS',
            assigned_to : $scope.CURRENT_SELECTED_WORKER.id,
            creator_id : $scope.CURRENT_USER.id,
            awbs : $scope.getAllSelectedShipments("IDS"),
            batch_no : HelperService.getTokenCode(5) + HelperService.getCurrentDate('ddmmyyyy')
        };

        //uploading ...
        $scope.change_loading_status(true,"ASSIGNING SHIPMENTS...");
        var conn = GServices.set_assignments(mydata);
        conn.then(
            function(response){
                $scope.IS_LOADING = false;
                if(response.status == 200 || 201 || 202 || 203 || 204){ 
                    $scope.AWB_LIST = [];
                    $scope.CURRENT_SELECTED_WORKER = null;

                    $scope.filterAssignments();
                }else{
                    //$scope.change_loading_status(true,response.data.msg_data);
                    $scope.change_loading_status(true,response.status);
                }
            },
            function(error){
                GDumpService.log(0, -1,error);
                $scope.change_loading_status(true,error.statusText);
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
    $scope.selectAll = function(){
        $scope.CHECK_ALL = $scope.CHECK_ALL ? false:true;
        for($i = 0; $i < $scope.SHIPMENTS.length;$i++){
           $scope.SHIPMENTS[$i].is_checked = $scope.CHECK_ALL; 
        }
    };

    $scope.filterAssignments = function(){
        $scope.SHIPMENTS = [];
    	$scope.change_loading_status(true,"Loading assignments ...");
    	var conn = GServices.filter_assignments( $scope.FILTER_OPTION);//alert('j')
        conn.then(
            function(response){
                $scope.IS_LOADING = false;
                if(response.status == 200 || 201 || 202 || 203 || 204){
                    $scope.SHIPMENTS = response.data.msg_data;//response.data;
                   
                    //console.log("F::" + JSON.stringify(CookieManagerService.getGeneralFilters()));

                    //apply filters 
                    /*var oldFilters = CookieManagerService.getGeneralFilters();
                    if(oldFilters == undefined){
                        CookieManagerService.saveGeneralFilters($scope.FILTER_OPTION);
                    }else{
                        $scope.FILTER_OPTION = oldFilters;
                        $scope.$parent.FILTER_OPTION = oldFilters;
                    }*/
                }else{
                }
            },
            function(error){
            	$scope.IS_LOADING = false;
                alert("SYSTEM ERROR");
            }
        );
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

                    $scope.get_workers_cs();

                    //apply filters
                    /*var oldFilters = CookieManagerService.getGeneralFilters();
                    if(oldFilters == undefined){
                        CookieManagerService.saveGeneralFilters($scope.FILTER_OPTION);
                    }else{
                        $scope.FILTER_OPTION = oldFilters;
                        $scope.$parent.FILTER_OPTION = oldFilters;
                    }*/
                }else{
                }
            },
            function(error){
            }
        );
    };
    $scope.get_workers_cs = function(){
        $scope.IS_LOADING = true;
        $scope.LOADING_MSG = "loading workers list ..";
        var conn = GServices.get_workers_cs();
        conn.then(
            function(response){
                $scope.IS_LOADING = false;
                if(response.status == 200 || 201 || 202 || 203 || 204){
                    $scope.CS_LIST = response.data.msg_data;//response.data;
                    $scope.CS_LIST.push({id:-3,username:' -- ALL ASSIGNED --'});
                    $scope.CS_LIST.push({id:-2,username:' -- ALL --'});
                    $scope.CS_LIST.push({id:-1,username:'-- ALL UN-ASSIGNED --'});
                    $scope.filterAssignments();
                }else{
                }
            },
            function(error){
            }
        );
    };
    $scope.reloadData = function(){
        $scope.get_vendors();
    };

    var init = function(){
        $scope.get_vendors();
    };
    init();

}]);



