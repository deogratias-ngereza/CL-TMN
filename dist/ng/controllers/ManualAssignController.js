
APP.controller('ManualAssignController', ['$scope','$state','$stateParams','AuthService','CookieManagerService','GServices','HelperService','GDumpService','DTOptionsBuilder', 'DTColumnDefBuilder',
 function($scope,$state,$stateParams,AuthService,CookieManagerService,GServices,HelperService,GDumpService,DTOptionsBuilder, DTColumnDefBuilder) {
    
    GDumpService.log(0, -1,"ManualAssignController");
    $scope.IS_LOADING = false;
    $scope.LOADING_MSG = "Loading ...";
    $scope.AWB_LIST = [];

    $scope.CURRENT_USER = $scope.$parent.CURRENT_USER;
    $scope.COMPANY_INFO = $scope.$parent.COMPANY_INFO;


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


    //assignCourierForPickupModal
    $scope.openAssignWorkerModal = function(obj){
    	$scope.PICKED_OBJ = obj;
    	jQuery("#assignWorkerModal").modal();
    };
    $scope.prepareThisWorker2BeAssigned = function(workerObj){
        $scope.CURRENT_SELECTED_WORKER = workerObj;
    };




    $scope.addNewAWB = function(){
    	var newAWB = {
    		track_no :'',info:'',status_obj:null,customer_set : false
    	};
    	$scope.AWB_LIST.push(newAWB);
    };
    $scope.removeAWB = function($index){
    	$scope.AWB_LIST.splice($index,1);
    };
    $scope.clearData = function(){
        $scope.AWB_LIST = [];
    }; 
    //

    $scope.AreInputFine = function(){
    	if($scope.AWB_LIST.length == 0) return false;
    	var okay = true;
    	for(i = 0; i < $scope.AWB_LIST.length;i++){ 
    		//if(!$scope.AWB_LIST[i].customer_set) okay = false;
    		if($scope.AWB_LIST[i].awb_no == "") okay = false;
    		if($scope.AWB_LIST[i].info == "") okay = false;
    		//if($scope.AWB_LIST[i].status_obj == null) okay = false;
    	}
    	return okay;
    };

    $scope.upload = function(){
    	jQuery("#assignWorkerModal").modal('toggle');
    	if(!$scope.AreInputFine()){
    		alert("INVALID FORM INPUTS!!");
    		return;
    	}
    	//prepare a list
    	var list = [];
    	for(i = 0; i < $scope.AWB_LIST.length;i++){
    		var objx = {
    			awb_no : $scope.AWB_LIST[i].awb_no,
    			shipment_id : $scope.AWB_LIST[i].shipment_id,
    			//status_name : $scope.AWB_LIST[i].status_obj.name,
    			//status_code : $scope.AWB_LIST[i].status_obj.code,
    			//status_id : $scope.AWB_LIST[i].status_obj.id,
    			customer_id : $scope.AWB_LIST[i].customer_id,

    		};
    		//var obj = $scope.AWB_LIST[i].shipment_id;
    		list.push($scope.AWB_LIST[i].shipment_id);
    	}
    	var mydata = {
    		group:'CS',
    		assigned_to : $scope.CURRENT_SELECTED_WORKER.id,
    		creator_id : $scope.CURRENT_USER.id,
    		awbs : list,
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

    $scope.setAwbInfo = function($awbIndex){//43012190604 
        var conn = GServices.get_min_awb_info({awb_no: $scope.AWB_LIST[$awbIndex]['awb_no'] });
        conn.then(
            function(response){
                if(response.status == 200 || 201 || 202 || 203 || 204){
                    if(response.data.msg_data != null){
                        $scope.AWB_LIST[$awbIndex]['info'] = "@" + response.data.msg_data.bill_duty_to 
                        	+ " [ " + response.data.msg_data.awb_no + " / "+response.data.msg_data.master_awb_no+" ]  "
                            + response.data.msg_data.shipper_name + " ***TO*** " 
                            + response.data.msg_data.consignee_name + ", ("
                            + response.data.msg_data.consignee_city + ") with "
                            + response.data.msg_data.weight + " "+response.data.msg_data.uom+". [ "
                            + response.data.msg_data.consignee_company + " ] : "
                            + response.data.msg_data.shipment_description + " :: "
                            + response.data.msg_data.lh_type
                        ;  
                        $scope.AWB_LIST[$awbIndex]['shipment_id'] = response.data.msg_data.id;
                        $scope.AWB_LIST[$awbIndex]['customer_id'] = response.data.msg_data.customer_id;
                        $scope.AWB_LIST[$awbIndex]['assigned_cs'] = response.data.msg_data.assigned_cs;
                        $scope.AWB_LIST[$awbIndex]['held'] = response.data.msg_data.held_at_customs !=null? 1:0;
                        $scope.AWB_LIST[$awbIndex]['master_awb_no'] = response.data.msg_data.master_awb_no;

                        $scope.AWB_LIST[$awbIndex]['pcs'] = response.data.msg_data.pcs;
                        $scope.AWB_LIST[$awbIndex]['pkg_counts'] = response.data.msg_data.pkg_counts;

                        //set customer set field
                        var customer_id = $scope.AWB_LIST[$awbIndex]['customer_id'];
                        $scope.AWB_LIST[$awbIndex]['customer_set'] = true;
                        if(customer_id == "" || customer_id == -1 || customer_id == null){
                        	$scope.AWB_LIST[$awbIndex]['customer_set'] = false;
                        }
                        //$scope.AWB_LIST[$awbIndex]['track_no'] = response.data.msg_data.track_no;
                        //return response.data.msg_data;
                    }else{
                    	$scope.AWB_LIST[$awbIndex]['info'] = "";
                    }
                    
                }else{
                    //$scope.change_loading_status(true,response.data.msg_data);
                   // $scope.change_loading_status(true,response.status);
                }
            },
            function(error){
                GDumpService.log(0, -1,error);
                //$scope.change_loading_status(true,error.statusText);
            }
        );
    };




	/*
     * RELOAD 
     */
    $scope.reloadData = function(){
    	$scope.IS_LOADING = false;
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
                }else{
                }
            },
            function(error){
            }
        );
    };

     /*
     * ON CLOSE MODAL
     */
     $scope.closeModal = function(){
        $scope.change_loading_status(false,"");
     };

     //get_exemption_status_codes
     /*ENTRY POINT*/
     var init = function(){
        $scope.get_workers_cs();
     };
     init();
}]); 


