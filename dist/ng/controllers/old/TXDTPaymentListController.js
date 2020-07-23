APP.controller('TXDTPaymentListController', ['$timeout','$scope','$state','$stateParams','AuthService','CookieManagerService','GServices','HelperService','GDumpService','DTOptionsBuilder', 'DTColumnDefBuilder',
 function($timeout,$scope,$state,$stateParams,AuthService,CookieManagerService,GServices,HelperService,GDumpService,DTOptionsBuilder, DTColumnDefBuilder) {
    
    GDumpService.log(0, -1,"TXDTPaymentListController"); 
    $scope.IS_LOADING = false; 
    $scope.LOADING_MSG = "Loading ...";

    $scope.GENERAL_FILTER = CookieManagerService.getGeneralFilters();

    $scope.FILTER_OPTION = { 
        client_id : $stateParams.vendor_id,
        search_key : "",
        start_date : $stateParams.start_dt,
        end_date:$stateParams.end_dt,
        lh_value:$stateParams.lh_value,
        //scan_type : "ALL", 
        //ro_generated : -1,//all,
        bill_to : $stateParams.bill_option,
        category:'TXTDPAYMENT_LIST'
    };

    $scope.CURRENT_USER = $scope.$parent.CURRENT_USER;
    $scope.COMPANY_INFO = $scope.$parent.COMPANY_INFO;

    $scope.VENDORS_LIST = [];//$scope.$parent.$scope.VENDORS_LIST;//CookieManagerService.getVendorsList();
     
    $scope.FILTER_OPTION.lh_value = $stateParams.lh_value;
    
    $timeout(function(){//alert($stateParams.vendor_id)
    	$scope.FILTER_OPTION.client_id = parseInt($stateParams.vendor_id);
    },200);

    //$scope.FILTER_OPTION.scan_type = $stateParams.scan_type;
    //$scope.FILTER_OPTION.ro_generated = parseInt($stateParams.ro_generated);
    /*if($stateParams.client_id != -1){
        $scope.FILTER_OPTION.client_id = $scope.CURRENT_USER.assigned_client_id;
    }
    $scope.FILTER_OPTION.client_id = $scope.CURRENT_USER.assigned_client_id;*/


    $scope.openEntryModal = function(data){
        $scope.PICKED_OBJ = data;
        jQuery("#entryUpdateForm").modal();
    };
    $scope.updateEntryInfo = function(){
        var obj = {
            user_id : $scope.CURRENT_USER.id,
            shipment_id : $scope.PICKED_OBJ.id,
            tabulation_id : $scope.PICKED_OBJ.tabulation.id,
            entry_status: $scope.PICKED_OBJ.tabulation.entry_status,
            entry_description : $scope.PICKED_OBJ.tabulation.entry_description,
            entry_no : $scope.PICKED_OBJ.tabulation.entry_no
        }
        var conn = GServices.updateEntryInfo(obj);
        conn.then(
            function(response){
                $scope.IS_LOADING = false;
                if(response.status == 200 || 201 || 202 || 203 || 204){ 
                    jQuery("#entryUpdateForm").modal('toggle');
                }else{
                }
            },
            function(error){
                alert("FAIL TO UPDATE ENTRY-INFORMATION!!");
            }
        );
    };
   //
    $scope.openDutyAndTaxPaymentListModal = function(data){
        $scope.PICKED_OBJ = data;
        $scope.PICKED_OBJ.dnt_payment = {
            entry_no : $scope.PICKED_OBJ.tabulation.entry_no,
            awb_no : $scope.PICKED_OBJ.awb_no,
            duty : $scope.PICKED_OBJ.tabulation.duty,
            exe_duty : $scope.PICKED_OBJ.tabulation.exe_duty,
            vat : $scope.PICKED_OBJ.tabulation.vat,
            idf : $scope.PICKED_OBJ.tabulation.idf,
            extra_idf : 0,
            rdl : $scope.PICKED_OBJ.tabulation.rdl,
            kaa : $scope.PICKED_OBJ.tabulation.concession,
            concession : $scope.PICKED_OBJ.tabulation.concession,
            total : $scope.PICKED_OBJ.tabulation.total_without_cbs_agency,
            currency : $scope.PICKED_OBJ.tabulation.currency,
            exchange_rate:$scope.PICKED_OBJ.tabulation.exchange_rate,
        };
        jQuery("#dutyAndTaxPaymentForm").modal();
    };
    //
    $scope.addDutyAndTaxPayment = function(){
        $scope.PICKED_OBJ.dnt_payment.creator_id = $scope.CURRENT_USER.id;
        $scope.PICKED_OBJ.dnt_payment.service_id = 1;//DUTY AND TAXES -- TODO: dropdown selector
        $scope.PICKED_OBJ.dnt_payment.shipment_id = $scope.PICKED_OBJ.id;
        var conn = GServices.add_duty_and_tax_payment_entry($scope.PICKED_OBJ.dnt_payment);
        conn.then(
            function(response){
                if(response.status == 200 || 201 || 202 || 203 || 204){ 
                    jQuery("#dutyAndTaxPaymentForm").modal('toggle');
                }else{
                }
            },
            function(error){
                GDumpService.log(0, -1,error);
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

    $scope.markAsPaid = function($index,data){

        var confirmRes = confirm("ARE YOU REAL SURE THAT YOU HAVE SET THE PAYMENTS?");
        if(confirmRes == true){
            $scope.SHIPMENTS[$index].status = "SET";
        }
        
    };
    //
    $scope.getTabulationStatusStyle= function(status){
        var style = "";
        switch(status){
            case 'TABULATED' : style="background-color:#89d989;color:gray;padding:4px;"; break; 
            case 'SET' : style="background-color:#89d989;color:gray;padding:4px;"; break; 
            case 'ISSUE' : style="background-color:red;color:white;padding:4px;"; break;
            case 'REQUESTED' : style="background-color:gray;color:white;padding:4px;"; break;
            case 'PENDING' : style="background-color:orange;color:gray;padding:4px;"; break;

            case 'APPROVED' : style="background-color:#89d989;color:gray;padding:4px;"; break; 
            case 'REGISTERED' : style="background-color:gray;color:white;padding:4px;"; break;
            
            case 'AWAITING' : style="background-color:gray;color:white;padding:4px;"; break;
            
            default:style= "background-color:white;color:gray;padding:4px;";break;
        }
        return style;
    };

    /**
     * READ
    */
    $scope.get_shipments_tabulations = function(){
      	$scope.change_loading_status(true,"loading payment-list ...");
     	var conn = GServices.txdt_filter($scope.FILTER_OPTION);
	    conn.then(
	        function(response){
	            $scope.IS_LOADING = false;
	            if(response.status == 200 || 201 || 202 || 203 || 204){ 
	                $scope.SHIPMENTS = response.data.msg_data;//response.data;
	                GDumpService.log(0, -1,$scope.SHIPMENTS);
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

    $scope.get_vendors = function(){ 
        var conn = GServices.get_vendors(); 
        conn.then(
            function(response){
                $scope.IS_LOADING = false;
                if(response.status == 200 || 201 || 202 || 203 || 204){
                    $scope.VENDORS_LIST = response.data.msg_data;//response.data;
                    $scope.VENDORS_LIST.push({id:-1,name:'ALL'});
                    $scope.get_shipments_tabulations();
                }else{
                }
            },
            function(error){
            }
        );
    };

	/*
     * RELOAD 
     */
    $scope.reloadData = function(){
  
        $scope.get_shipments_tabulations();
    };
    

     /*
     * ON CLOSE MODAL
     */
     $scope.closeModal = function(){
        $scope.change_loading_status(false,"");
     };


     /*ENTRY POINT*/
     var init = function(){
     	
        $scope.get_vendors();

     };
     init();
}]); 