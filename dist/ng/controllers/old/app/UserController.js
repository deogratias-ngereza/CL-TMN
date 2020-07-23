
APP.controller('UserController', ['$scope','$state','AuthService','CookieManagerService','GServices','HelperService','GDumpService','DTOptionsBuilder', 'DTColumnDefBuilder',
 function($scope,$state,AuthService,CookieManagerService,GServices,HelperService,GDumpService,DTOptionsBuilder, DTColumnDefBuilder) {
    
    GDumpService.log(0, -1,"UserController");
    $scope.IS_LOADING = false;
    $scope.LOADING_MSG = "Loading ...";
    $scope.SEARCH_OBJ = { search_key : ""};

    //top bar
    $scope.$parent.show_top_bar(0);

    /**relation variables**/
    
    $scope.UNITS_LIST = [];
    
    $scope.BRANCHES_LIST = [];
     /**--relation variables**/


    $scope.USERS_LIST = [];
    $scope.PICKED_OBJ = {};//for edit,view and delete with in the modal
    $scope.EDITABLE_OBJ = {};//for editing
    $scope.NEW_OBJ = {};//for addition 
    $scope.SEARCH_KEY = "";

    $scope.NEW_OBJ.account_no = HelperService.getUserAccountNo(6);

    $scope.dtOptions = DTOptionsBuilder.newOptions()
        //.withPaginationType('full_numbers')
        .withDisplayLength(10)
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

    $scope.openPasswordModal = function(obj){
        $scope.PICKED_OBJ = obj;
        jQuery("#editPasswordModal").modal();
    };

    /**relation functions**/
    
    /**
     * READ ALL UNITS
    */
    var get_all_units = function(){
      $scope.change_loading_status(true,"loading units ...");
        var conn = GServices.get_units();
        conn.then(
            function(response){
                $scope.IS_LOADING = false;
                if(response.status == 200 || 201 || 202 || 203 || 204){
                    $scope.UNITS_LIST = response.data.msg_data;//response.data;
                    GDumpService.log(0, -1,$scope.UNITS_LIST);

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
     * READ ALL BRANCHES
    */
    var get_all_branches = function(){
      $scope.change_loading_status(true,"loading branches ...");
        var conn = GServices.get_branches();
        conn.then(
            function(response){
                $scope.IS_LOADING = false;
                if(response.status == 200 || 201 || 202 || 203 || 204){
                    $scope.BRANCHES_LIST = response.data.msg_data;//response.data;
                    GDumpService.log(0, -1,$scope.BRANCHES_LIST);
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
     
    /** -- relation functions**/


    $scope.deep_search_user = function(){
        alert("user");
    };



    /**
     * READ ALL USERS
    */
    var get_all = function(){
      $scope.change_loading_status(true,"loading users ...");
     	var conn = GServices.get_users();
	    conn.then(
	        function(response){
	            $scope.IS_LOADING = false;
	            if(response.status == 200 || 201 || 202 || 203 || 204){
	                $scope.USERS_LIST = response.data.msg_data;//response.data;
	                GDumpService.log(0, -1,$scope.USERS_LIST);
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
     * READ ALL SINGLE USER
     * not used from auto generated
    */
    var get_single_user = function(){
        $scope.change_loading_status(true,"loading a single user ...");
        var conn = GServices.get_single_user({id : 1});//TODO
        conn.then(
            function(response){
                $scope.IS_LOADING = false;
                if(response.status == 200 || 201 || 202 || 203 || 204){
                    $scope.USERS_LIST = response.data.msg_data;//response.data;
                    GDumpService.log(0, -1,$scope.USERS_LIST);
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
        $scope.change_loading_status(true,"searching users ...");
        var conn = GServices.get_user_search({key : $scope.SEARCH_KEY });
        conn.then(
            function(response){
                $scope.IS_LOADING = false;
                if(response.status == 200 || 201 || 202 || 203 || 204){
                    $scope.USERS_LIST = response.data.msg_data;//response.data;
                    GDumpService.log(0, -1,$scope.USERS_LIST);
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
     * ON UPDATE USER
     */
    $scope.update = function(){
        delete $scope.EDITABLE_OBJ.branch_info;
        delete $scope.EDITABLE_OBJ.unit_info;
        $scope.change_loading_status(true,"updating a user ... ");
        var conn = GServices.post_user_update($scope.EDITABLE_OBJ );
        conn.then(
            function(response){
                $scope.IS_LOADING = false;
                if(response.status == 200 || 201 || 202 || 203 || 204){
                    GDumpService.log(0, -1,response);
                    $scope.NEW_OBJ.account_no = HelperService.getUserAccountNo(6);
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
     * ADD NEW USER  
     */
    $scope.addNew = function(){

        if($scope.NEW_OBJ.unit_id == undefined || $scope.NEW_OBJ.branch_id == undefined) return;
       
        $scope.change_loading_status(true,"adding a new user ... ");
        var conn = GServices.post_user_insert($scope.NEW_OBJ);
        conn.then(
            function(response){
                $scope.IS_LOADING = false;
                if(response.status == 200 || 201 || 202 || 203 || 204){
                    GDumpService.log(0, -1,response);
                    $scope.NEW_OBJ = {};
                    get_all();
                    $scope.NEW_OBJ.account_no = HelperService.getUserAccountNo(6);
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
     * ON DELETE USER
     */
    $scope.delete = function(){
        $scope.change_loading_status(true,"deleting a user ... ");
        var conn = GServices.post_user_delete({id : $scope.PICKED_OBJ.id });
        conn.then(
            function(response){
                $scope.IS_LOADING = false;
                if(response.status == 200 || 201 || 202 || 203 || 204){
                    GDumpService.log(0, -1,response);
                    jQuery("#deleteModal").modal('toggle');
                    get_all();
                    $scope.NEW_OBJ.account_no = HelperService.getUserAccountNo(6);
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


    $scope.updateUsersPassword = function(){
        jQuery("#editPasswordModal").modal('toggle');
    };
 





    /*
     * RELOAD USERS DATA
     */
    $scope.reloadData = function(){
        
        get_all_units();
        
        get_all_branches();
        
        get_all();
        $scope.NEW_OBJ.account_no = HelperService.getUserAccountNo(6);
    };
    

     /*
     * ON CLOSE MODAL
     */
     $scope.closeModal = function(){
        $scope.change_loading_status(false,"");
     };


     /*ENTRY POINT*/
     var init = function(){
        
        get_all_units();
        
        get_all_branches();
        
        get_all();
        $scope.NEW_OBJ.account_no = HelperService.getUserAccountNo(6);
     };
     init();
}]); 