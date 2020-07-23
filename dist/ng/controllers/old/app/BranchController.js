
APP.controller('BranchController', ['$scope','$state','AuthService','CookieManagerService','GServices','HelperService','GDumpService','DTOptionsBuilder', 'DTColumnDefBuilder',
 function($scope,$state,AuthService,CookieManagerService,GServices,HelperService,GDumpService,DTOptionsBuilder, DTColumnDefBuilder) {
    
    GDumpService.log(0, -1,"BranchController");
    $scope.IS_LOADING = false;
    $scope.LOADING_MSG = "Loading ...";
    $scope.SEARCH_OBJ = { search_key : ""};

    //top bar
    $scope.$parent.show_top_bar(1);

    /**relation variables**/
     /**--relation variables**/


    $scope.BRANCHES_LIST = [];
    $scope.PICKED_OBJ = {};//for edit,view and delete with in the modal
    $scope.EDITABLE_OBJ = {};//for editing
    $scope.NEW_OBJ = {};//for addition 
    $scope.SEARCH_KEY = "";

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



    /**relation functions**/
     
    /** -- relation functions**/


    $scope.deep_search_branch = function(){
        alert("branch");
    };



    /**
     * READ ALL BRANCHES
    */
    var get_all = function(){
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

      
    /**
     * READ ALL SINGLE BRANCH
     * not used from auto generated
    */
    var get_single_branch = function(){
        $scope.change_loading_status(true,"loading a single branch ...");
        var conn = GServices.get_single_branch({id : 1});//TODO
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


    /**
     * SEARCH FROM SERVER
     */
    $scope.search_from_server = function(){
        $scope.change_loading_status(true,"searching branches ...");
        var conn = GServices.get_branch_search({key : $scope.SEARCH_KEY });
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
     



    /*
     * ON UPDATE BRANCH
     */
    $scope.update = function(){
        $scope.change_loading_status(true,"updating a branch ... ");
        var conn = GServices.post_branch_update($scope.EDITABLE_OBJ );
        conn.then(
            function(response){
                $scope.IS_LOADING = false;
                if(response.status == 200 || 201 || 202 || 203 || 204){
                    GDumpService.log(0, -1,response);
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
     * ADD NEW BRANCH  
     */
    $scope.addNew = function(){
       
        $scope.change_loading_status(true,"adding a new branch ... ");
        var conn = GServices.post_branch_insert($scope.NEW_OBJ);
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
     * ON DELETE BRANCH
     */
    $scope.delete = function(){
        $scope.change_loading_status(true,"deleting a branch ... ");
        var conn = GServices.post_branch_delete({id : $scope.PICKED_OBJ.id });
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
     * RELOAD BRANCHES DATA
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