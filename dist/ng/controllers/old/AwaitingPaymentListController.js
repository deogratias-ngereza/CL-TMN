
APP.controller('AwaitingPaymentListController', ['$scope','$state','AuthService','CookieManagerService','GServices','HelperService','GDumpService','DTOptionsBuilder', 'DTColumnDefBuilder',
 function($scope,$state,AuthService,CookieManagerService,GServices,HelperService,GDumpService,DTOptionsBuilder, DTColumnDefBuilder) {
    
    GDumpService.log(0, -1,"AwaitingPaymentListController");
    $scope.IS_LOADING = false;
    $scope.LOADING_MSG = "Loading ...";

    $scope.CURRENT_USER = $scope.$parent.CURRENT_USER;
    $scope.COMPANY_INFO = $scope.$parent.COMPANY_INFO;
    $scope.TODAYS_DATE = $scope.$parent.TODAYS_DATE;

    $scope.SEARCH_OBJ = { search_key : "",start_date: $scope.TODAYS_DATE,end_date:$scope.TODAYS_DATE};

    //top bar
    $scope.$parent.show_top_bar(1);

    /**relation variables**/
     /**--relation variables**/


    $scope.AWAITING_PAYMENT_LISTS_LIST = [];
    $scope.PICKED_OBJ = {};//for edit,view and delete with in the modal
    $scope.EDITABLE_OBJ = {};//for editing
    $scope.NEW_OBJ = {};//for addition 
    $scope.SEARCH_KEY = "";

    
    function cloneObject(obj) {
        var clone = {};
        for(var i in obj) {
            if(obj[i] != null &&  typeof(obj[i])=="object")
                clone[i] = cloneObject(obj[i]);
            else
                clone[i] = obj[i];
        }
        return clone;
    }


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



    /**relation functions**/
     
    /** -- relation functions**/


    $scope.deep_search_awaiting_payment_list = function(){
        alert("awaiting_payment_list");
    };


    $scope.getStatusStyle = function(status){
        var styles = "";
        switch(status){
            case 'AWAITING': styles = "background-color:orange;color:white;";break;
            case 'ISSUES': styles = "background-color:red;color:white;";break;
            case 'CONFIRMED': styles = "background-color:green;color:white;";break;
            case 'PAID': styles = "background-color:green;color:white;";break;
            case 'PENDING': styles = "background-color:gray;color:white;";break;
        }
        return styles;
    };

    /**
     * READ ALL AWAITING_PAYMENT_LISTS
    */
    var get_all = function(){
      $scope.change_loading_status(true,"loading awaiting_payment_lists ...");
        var conn = GServices.filter_awaiting_payment_list($scope.SEARCH_OBJ.start_date,$scope.SEARCH_OBJ.end_date);
        conn.then(
            function(response){
                $scope.IS_LOADING = false;
                if(response.status == 200 || 201 || 202 || 203 || 204){
                    $scope.AWAITING_PAYMENT_LISTS_LIST = response.data.msg_data;//response.data;
                    GDumpService.log(0, -1,$scope.AWAITING_PAYMENT_LISTS_LIST);
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
    $scope.filterShipments = function(){
        get_all();
    };
      
    /**
     * READ ALL SINGLE AWAITING_PAYMENT_LIST
     * not used from auto generated
    */
    var get_single_awaiting_payment_list = function(){
        $scope.change_loading_status(true,"loading a single awaiting_payment_list ...");
        var conn = GServices.get_single_awaiting_payment_list({id : 1});//TODO
        conn.then(
            function(response){
                $scope.IS_LOADING = false;
                if(response.status == 200 || 201 || 202 || 203 || 204){
                    $scope.AWAITING_PAYMENT_LISTS_LIST = response.data.msg_data;//response.data;
                    GDumpService.log(0, -1,$scope.AWAITING_PAYMENT_LISTS_LIST);
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
        $scope.change_loading_status(true,"searching awaiting_payment_lists ...");
        var conn = GServices.get_awaiting_payment_list_search({key : $scope.SEARCH_KEY });
        conn.then(
            function(response){
                $scope.IS_LOADING = false;
                if(response.status == 200 || 201 || 202 || 203 || 204){
                    $scope.AWAITING_PAYMENT_LISTS_LIST = response.data.msg_data;//response.data;
                    GDumpService.log(0, -1,$scope.AWAITING_PAYMENT_LISTS_LIST);
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
     * ON UPDATE AWAITING_PAYMENT_LIST
     */
    $scope.update = function(){
        var oldObj = cloneObject($scope.EDITABLE_OBJ);;//HelperService.cloneObject($scope.EDITABLE_OBJ);
        delete $scope.EDITABLE_OBJ.shipment;
        $scope.change_loading_status(true,"updating a awaiting_payment_list ... ");
        var conn = GServices.update_awaiting_list($scope.EDITABLE_OBJ );
        conn.then(
            function(response){
                $scope.IS_LOADING = false;
                if(response.status == 200 || 201 || 202 || 203 || 204){
                    GDumpService.log(0, -1,response);
                    $scope.EDITABLE_OBJ.shipment = oldObj.shipment;
                }else{
                    //$scope.change_loading_status(true,response.data.msg_data);
                    $scope.change_loading_status(true,response.status);
                    $scope.EDITABLE_OBJ.shipment = oldObj.shipment;
                }
            },
            function(error){
               GDumpService.log(0, -1,error);
                $scope.change_loading_status(true,error.statusText);
                $scope.EDITABLE_OBJ.shipment = oldObj.shipment;
            }
        );
    };

    /*
     * ADD NEW AWAITING_PAYMENT_LIST  
     */
    $scope.addNew = function(){
       
        $scope.change_loading_status(true,"adding a new awaiting_payment_list ... ");
        var conn = GServices.post_awaiting_payment_list_insert($scope.NEW_OBJ);
        conn.then(
            function(response){
                $scope.IS_LOADING = false;
                if(response.status == 200 || 201 || 202 || 203 || 204){
                    GDumpService.log(0, -1,response);
                    $scope.NEW_OBJ = {};
                    get_all();
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
     * ON DELETE AWAITING_PAYMENT_LIST
     */
    $scope.delete = function(){
        $scope.change_loading_status(true,"deleting a awaiting_payment_list ... ");
        var conn = GServices.post_awaiting_payment_list_delete({id : $scope.PICKED_OBJ.id });
        conn.then(
            function(response){
                $scope.IS_LOADING = false;
                if(response.status == 200 || 201 || 202 || 203 || 204){
                    GDumpService.log(0, -1,response);
                    jQuery("#deleteModal").modal('toggle');
                    get_all();
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
     * RELOAD AWAITING_PAYMENT_LISTS DATA
     */
    $scope.reloadData = function(){
        
        get_all();
    };
    

     /*
     * ON CLOSE MODAL
     */
     $scope.closeModal = function(){
        $scope.change_loading_status(false,"");
     };


     /*ENTRY POINT*/
     var init = function(){
        
        get_all();
     };
     init();
}]); 