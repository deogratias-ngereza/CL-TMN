
APP.controller('PaymentCollectionController', ['$scope','$state','AuthService','CookieManagerService','GServices','HelperService','GDumpService','DTOptionsBuilder', 'DTColumnDefBuilder',
 function($scope,$state,AuthService,CookieManagerService,GServices,HelperService,GDumpService,DTOptionsBuilder, DTColumnDefBuilder) {
    
    GDumpService.log(0, -1,"PaymentCollectionController");
    $scope.IS_LOADING = false;
    $scope.LOADING_MSG = "Loading ...";
   
    $scope.CURRENT_USER = $scope.$parent.CURRENT_USER;
    $scope.COMPANY_INFO = $scope.$parent.COMPANY_INFO;
    $scope.TODAYS_DATE = $scope.$parent.TODAYS_DATE;

    $scope.SEARCH_OBJ = { 
        status:'ALL',
        filter_by:'UPDATED_DATE',
        search_key : "",
        start_date:$scope.TODAYS_DATE,
        end_date:$scope.TODAYS_DATE,
        branch_id:-1//$scope.CURRENT_USER.branch_id
    };


    //top bar
    $scope.$parent.show_top_bar(0);

    /**relation variables**/
     /**--relation variables**/


    $scope.PAYMENT_COLLECTIONS_LIST = [];
    $scope.PICKED_OBJ = {};//for edit,view and delete with in the modal
    $scope.EDITABLE_OBJ = {};//for editing
    $scope.NEW_OBJ = {};//for addition 
    $scope.PAYMENT_STATUS_OBJ = {};
    $scope.SEARCH_KEY = "";

    $scope.dtOptions = DTOptionsBuilder.newOptions()
        //.withPaginationType('full_numbers')
        .withDisplayLength(2000)
        //.withDOM('pitrfl');
    $scope.dtColumnDefs = [/*DTColumnDefBuilder.newColumnDef(0),//DTColumnDefBuilder.newColumnDef(1).notVisible(),//DTColumnDefBuilder.newColumnDef(2).notSortable()*/
    ];

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
     * add,view,edit & delete modals
    */
    $scope.btnAdd = function(){jQuery("#addModal").modal();};
    $scope.btnView = function(obj){jQuery("#viewModal").modal();$scope.PICKED_OBJ = obj;};
    $scope.btnDelete = function(obj){jQuery("#deleteModal").modal();$scope.PICKED_OBJ = obj;};
    $scope.btnEdit = function(obj){jQuery("#editModal").modal();$scope.PICKED_OBJ = obj;$scope.EDITABLE_OBJ = $scope.PICKED_OBJ;};
    $scope.btnSearch = function(obj){jQuery("#searchModal").modal();};

    $scope.openChangeStatusModal = function($index,obj){
        $scope.PICKED_OBJ = obj;
        $scope.PICKED_OBJ.index_id = $index;
        $scope.PAYMENT_STATUS_OBJ = {
            shipment_id : $scope.PICKED_OBJ.shipment_id,
            //id:$scope.PICKED_OBJ.id,
            status:$scope.PICKED_OBJ.status,
            comment:$scope.PICKED_OBJ.comment,
            description:$scope.PICKED_OBJ.description,
            payment_ref:$scope.PICKED_OBJ.payment_ref,
            updated_by:$scope.CURRENT_USER.id,
            confirmed_amount:$scope.PICKED_OBJ.paid_amount,
        };
        jQuery("#changeStatusModal").modal();
    };
    $scope.applyPaymentStatus = function($index){
        $scope.PAYMENT_COLLECTIONS_LIST[$index].status = "UPDATING";
        var obj = {
            payment_obj : $scope.PAYMENT_STATUS_OBJ,
            worker_id : $scope.CURRENT_USER.id,
            payment_collection_id : $scope.PICKED_OBJ.id
        };
        var conn = GServices.change_payment_status(obj);
        conn.then(
            function(response){
                if(response.status == 200 || 201 || 202 || 203 || 204){
                    $scope.PAYMENT_COLLECTIONS_LIST[$index] = response.data.msg_data;//response.data;
                    GDumpService.log(0, -1,$scope.PAYMENT_COLLECTIONS_LIST);
                }else{
                    //$scope.change_loading_status(true,response.data.msg_data);
                    //$scope.change_loading_status(true,response.status);
                    alert("SOMETHING WENT WRONG!!!"); 
                    $scope.PAYMENT_COLLECTIONS_LIST[$index].status = "ERROR";
                }
            },
            function(error){
                GDumpService.log(0, -1,error);
                //$scope.change_loading_status(true,error.statusText);
                alert("ERROR OCCURRED!!");
                $scope.PAYMENT_COLLECTIONS_LIST[$index].status = "-ERROR-";
            }
        );

    };

    $scope.getStatusStyle = function(status){
        var styles = "";
        switch(status){
            case 'AWAITING': styles = "background-color:orange;color:white;";break;
            case 'ISSUES': styles = "background-color:red;color:white;";break;
            case 'ISSUE': styles = "background-color:red;color:white;";break;
            case 'CONFIRMED': styles = "background-color:green;color:white;";break;
            case 'PAID': styles = "background-color:green;color:white;";break;
            case 'PENDING': styles = "background-color:orange;color:white;";break;
        }
        return styles;
    };


    /**relation functions**/
     
    /** -- relation functions**/


    $scope.deep_search_payment_collection = function(){
        alert("payment_collection");
    };



    /**
     * READ ALL PAYMENT_COLLECTIONS
    */
    var xxget_all = function(){
      $scope.change_loading_status(true,"loading payment_collections ...");
     	var conn = GServices.get_payment_collections();
	    conn.then(
	        function(response){
	            $scope.IS_LOADING = false;
	            if(response.status == 200 || 201 || 202 || 203 || 204){
	                $scope.PAYMENT_COLLECTIONS_LIST = response.data.msg_data;//response.data;
	                GDumpService.log(0, -1,$scope.PAYMENT_COLLECTIONS_LIST);
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
    $scope.filter_collections = function(){
        //$scope.change_loading_status(true,"loading payment_collections ...");
        if($scope.SEARCH_OBJ.search_key == "" && $scope.SEARCH_OBJ.filter_by == "AWB"){
            alert("PLEASE ENTER AWB-NO!!");
            return;
        }

        var conn = GServices.filter_payment_collections($scope.SEARCH_OBJ);
        conn.then(
            function(response){
                //$scope.IS_LOADING = false;
                if(response.status == 200 || 201 || 202 || 203 || 204){
                    $scope.PAYMENT_COLLECTIONS_LIST = response.data.msg_data;//response.data;
                    GDumpService.log(0, -1,$scope.PAYMENT_COLLECTIONS_LIST);
                    //$scope.calculate();
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

      
    /**
     * READ ALL SINGLE PAYMENT_COLLECTION
     * not used from auto generated
    */
    var get_single_payment_collection = function(){
        $scope.change_loading_status(true,"loading a single payment_collection ...");
        var conn = GServices.get_single_payment_collection({id : 1});//TODO
        conn.then(
            function(response){
                $scope.IS_LOADING = false;
                if(response.status == 200 || 201 || 202 || 203 || 204){
                    $scope.PAYMENT_COLLECTIONS_LIST = response.data.msg_data;//response.data;
                    GDumpService.log(0, -1,$scope.PAYMENT_COLLECTIONS_LIST);
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
     * SEARCH FROM SERVER
     */
    $scope.search_from_server = function(){
        $scope.change_loading_status(true,"searching payment_collections ...");
        var conn = GServices.get_payment_collection_search({key : $scope.SEARCH_KEY });
        conn.then(
            function(response){
                $scope.IS_LOADING = false;
                if(response.status == 200 || 201 || 202 || 203 || 204){
                    $scope.PAYMENT_COLLECTIONS_LIST = response.data.msg_data;//response.data;
                    GDumpService.log(0, -1,$scope.PAYMENT_COLLECTIONS_LIST);
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
     * ON UPDATE PAYMENT_COLLECTION
     */
    $scope.update = function(){

    	//cloning an obj 
    	var oldObj = HelperService.cloneObject($scope.EDITABLE_OBJ);

    	delete $scope.EDITABLE_OBJ.shipment;
    	delete $scope.EDITABLE_OBJ.payable_service;
    	delete $scope.EDITABLE_OBJ.creator;
    	delete $scope.EDITABLE_OBJ.broker;

        $scope.change_loading_status(true,"updating an entry ... ");
        var conn = GServices.post_payment_collection_update($scope.EDITABLE_OBJ );
        conn.then(
            function(response){
                $scope.IS_LOADING = false;
                if(response.status == 200 || 201 || 202 || 203 || 204){
                    GDumpService.log(0, -1,response);

                    $scope.EDITABLE_OBJ.shipment = oldObj.shipment;
                    $scope.EDITABLE_OBJ.payable_service = oldObj.payable_service;
                    $scope.EDITABLE_OBJ.creator = oldObj.creator;
                    $scope.EDITABLE_OBJ.broker = oldObj.broker;

                }else{
                    //$scope.change_loading_status(true,response.data.msg_data);
                    $scope.change_loading_status(true,response.status);

                    $scope.EDITABLE_OBJ.shipment = oldObj.shipment;
                    $scope.EDITABLE_OBJ.payable_service = oldObj.payable_service;
                    $scope.EDITABLE_OBJ.creator = oldObj.creator;
                    $scope.EDITABLE_OBJ.broker = oldObj.broker;
                }
            },
            function(error){
            	$scope.EDITABLE_OBJ.shipment = oldObj.shipment;
                $scope.EDITABLE_OBJ.payable_service = oldObj.payable_service;
                $scope.EDITABLE_OBJ.creator = oldObj.creator;
                $scope.EDITABLE_OBJ.broker = oldObj.broker;

               GDumpService.log(0, -1,error);
            	$scope.change_loading_status(true,error.statusText);
            }
        );
    };

    /*
     * ADD NEW PAYMENT_COLLECTION  
     */
    $scope.addNew = function(){

        $scope.change_loading_status(true,"adding a new payment_collection ... ");
        var conn = GServices.post_payment_collection_insert($scope.NEW_OBJ);
        conn.then(
            function(response){
                $scope.IS_LOADING = false;
                if(response.status == 200 || 201 || 202 || 203 || 204){
                    GDumpService.log(0, -1,response);
                    $scope.NEW_OBJ = {};
                    $scope.filter_collections();
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
     * ON DELETE PAYMENT_COLLECTION
     */
    $scope.delete = function(){
        $scope.change_loading_status(true,"deleting a payment_collection ... ");
        var conn = GServices.post_payment_collection_delete({id : $scope.PICKED_OBJ.id });
        conn.then(
            function(response){
                $scope.IS_LOADING = false;
                if(response.status == 200 || 201 || 202 || 203 || 204){
                    GDumpService.log(0, -1,response);
                    jQuery("#deleteModal").modal('toggle');
                    $scope.filter_collections();
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
     * RELOAD PAYMENT_COLLECTIONS DATA
     */
    $scope.reloadData = function(){
        
        $scope.filter_collections();
    };
    

     /*
     * ON CLOSE MODAL
     */
     $scope.closeModal = function(){
        $scope.change_loading_status(false,"");
     };


     /*ENTRY POINT*/
     var init = function(){
        
        $scope.filter_collections();
     };
     init();
}]); 