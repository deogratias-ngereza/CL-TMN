

APP.controller('UnitAccessControlController', ['$scope','$state','$stateParams','AuthService','CookieManagerService','GServices','HelperService','GDumpService','DTOptionsBuilder', 'DTColumnDefBuilder',
 function($scope,$state,$stateParams,AuthService,CookieManagerService,GServices,HelperService,GDumpService,DTOptionsBuilder, DTColumnDefBuilder) {
    
    GDumpService.log(0, -1,"UnitAccessControlController");
    $scope.IS_LOADING = false;
    $scope.LOADING_MSG = "Loading ...";
    $scope.SEARCH_OBJ = { search_key : ""};

    $scope.ACCESS_CONTROLS_LIST = [];

    $scope.CHECK_ALL = false;
    //top bar
    $scope.$parent.show_top_bar(0);
    $scope.PAGE_NAME = $stateParams.unit_name;
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



	/**
     * READ ALL ACCESS_CONTROLS FOR GIVEN UNIT
    */
    var get_all_unit_access_controls = function(){
      $scope.change_loading_status(true,"loading access_controls ...");
     	var conn = GServices.get_unit_access_controls($stateParams.unit_id);
	    conn.then(
	        function(response){
	            $scope.IS_LOADING = false;
	            if(response.status == 200 || 201 || 202 || 203 || 204){
	                $scope.UNIT_ACCESS_CONTROLS = response.data.msg_data;//response.data;
	                GDumpService.log(0, -1,$scope.UNIT_ACCESS_CONTROLS);

	                //check all pressent access in access-list
	                for(var i = 0; i < $scope.ACCESS_CONTROLS_LIST.length;i++){
	                	for(var j = 0; j < $scope.UNIT_ACCESS_CONTROLS.length;j++){
	                		if($scope.ACCESS_CONTROLS_LIST[i].id == $scope.UNIT_ACCESS_CONTROLS[j].access_control.id){
	                			$scope.ACCESS_CONTROLS_LIST[i].isChecked = true;
	                		}
	                	}
	                }
	                //
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
     * READ ALL ACCESS_CONTROLS
    */
    var get_all_access_controls = function(){
      $scope.change_loading_status(true,"loading access_controls ...");
     	var conn = GServices.get_access_controls();
	    conn.then(
	        function(response){
	            $scope.IS_LOADING = false;
	            if(response.status == 200 || 201 || 202 || 203 || 204){
	                $scope.ACCESS_CONTROLS_LIST = response.data.msg_data;//response.data;
	                GDumpService.log(0, -1,$scope.ACCESS_CONTROLS_LIST);

	                //put all access to unchecked
	                for(var i = 0; i < $scope.ACCESS_CONTROLS_LIST.length;i++){
	                	$scope.ACCESS_CONTROLS_LIST[i].isChecked = false;
	                }
	                get_all_unit_access_controls();//this unit access
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

    $scope.checkUncheckAll = function(){

    	for(var i = 0; i < $scope.ACCESS_CONTROLS_LIST.length;i++){
    		$scope.ACCESS_CONTROLS_LIST[i].isChecked = $scope.CHECK_ALL;
    	}

    	if($scope.CHECK_ALL){
    		$scope.CHECK_ALL = false;
    	}else {
    		$scope.CHECK_ALL = true;
    	}
    };

    $scope.grantAccess = function(){
    	var access_ids_list = [];
    	for(var i = 0; i < $scope.ACCESS_CONTROLS_LIST.length;i++){
    		if($scope.ACCESS_CONTROLS_LIST[i].isChecked){
    			access_ids_list.push({
    				unit_id : $stateParams.unit_id,
    				access_control_id : $scope.ACCESS_CONTROLS_LIST[i].id
    			});
    		}
    	}

    	var obj = {
    		unit_id : parseInt($stateParams.unit_id),
    		list : access_ids_list
    	};
    	if(access_ids_list.length == 0 ) return;//stop here

    	//
    	$scope.change_loading_status(true,"granting access ... ");
        var conn = GServices.post_access_control_grand_access(obj);
        conn.then(
            function(response){
                $scope.IS_LOADING = false;
                if(response.status == 200 || 201 || 202 || 203 || 204){
                    GDumpService.log(0, -1,response);
                    $scope.reloadData();
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


  /*
     * RELOAD ACCESS_CONTROLS DATA
     */
    $scope.reloadData = function(){
        
        get_all_access_controls();
    };
    

     /*
     * ON CLOSE MODAL
     */
     $scope.closeModal = function(){
        $scope.change_loading_status(false,"");
     };


     /*ENTRY POINT*/
     var init = function(){
        
        get_all_access_controls();
     };
     init();
}]); 