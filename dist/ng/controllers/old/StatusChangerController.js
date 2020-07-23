APP.controller('StatusChangerController', ['$timeout','$scope','$stateParams','$state','AuthService','BASE_SERVER_URL','CookieManagerService','GServices','HelperService','GDumpService',
 function($timeout,$scope,$stateParams,$state,AuthService,BASE_SERVER_URL,CookieManagerService,GServices,HelperService,GDumpService) {
 	$scope.IS_LOADING = false;
    $scope.LOADING_MSG = "Loading ...";

 	$scope.TODAYS_DATE = HelperService.getCurrentDate('yyyy-mm-dd');
 	$scope.CURRENT_USER = $scope.$parent.CURRENT_USER;
    $scope.COMPANY_INFO = $scope.$parent.COMPANY_INFO;

    $scope.FILTER_DATA = {
    	shipment_id : $stateParams.shipment_id,
    	awb_no : $stateParams.awb_no,
    	selected_broker : undefined,
    	broker_search_key : '',
    	doc_collection_date : $scope.TODAYS_DATE,
    	phy_ship_released_date : $scope.TODAYS_DATE,
    	color:'',
    	collector_name:'',
    	collection_category:'BROKER',
    	status : '',
    	remarks:''
    };

    $scope.BROKERS_LIST = {};

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

    $scope.openSearchBrokerModal = function(){
    	jQuery("#searchBrokerModal").modal();
    };


 	$scope.search_broker = function(){
        var conn = GServices.search_broker($scope.FILTER_DATA.broker_search_key);
        conn.then(
            function(response){
                if(response.status == 200 || 201 || 202 || 203 || 204){
                    $scope.BROKERS_LIST = response.data.msg_data;//response.data;
                }else{
                }
            },
            function(error){
            }
        );
    };

    /*SET FUNCTIONS*/
    $scope.pickBroker = function(data){
    	$scope.FILTER_DATA.selected_broker = data;
    	jQuery("#searchBrokerModal").modal('toggle');

    	var obj = {
    		shipment_id:parseInt($scope.FILTER_DATA.shipment_id),
    		broker_id :$scope.FILTER_DATA.selected_broker.id,
    		creator_id : $scope.CURRENT_USER.id
    	};
    	var conn = GServices.set_awb_broker(obj);
        conn.then(
            function(response){
                if(response.status == 200 || 201 || 202 || 203 || 204){
                    alert('BROKER SET');
                }else{
                	alert('BROKER NOT SET');
                }
            },
            function(error){
            	alert('BROKER NOT SET:ERROR');
            }
        );
    };
    $scope.confirmCollection = function(){
    	var obj = {
    		shipment_id:parseInt($scope.FILTER_DATA.shipment_id),
    		creator_id : $scope.CURRENT_USER.id,
    		collector_name : $scope.FILTER_DATA.collector_name,
    		doc_collection_date : $scope.FILTER_DATA.doc_collection_date,
    		collected_by_broker : $scope.FILTER_DATA.collection_category == 'INDIVIDUAL'?0:1
    	};
    	var conn = GServices.set_collection_details(obj);
        conn.then(
            function(response){
                if(response.status == 200 || 201 || 202 || 203 || 204){
                    alert('COLLECTON-DETAILS-SET');
                }else{
                	alert('COLLECTION-NOT-SET');
                }
            },
            function(error){
            	alert('COLLECTION-NOT-SET:ERROR');
            }
        );
    };
    $scope.confirmRelease = function(){
    	var obj = {
    		shipment_id:parseInt($scope.FILTER_DATA.shipment_id),
    		creator_id : $scope.CURRENT_USER.id,
    		phy_ship_released_date : $scope.FILTER_DATA.phy_ship_released_date
    	};
    	var conn = GServices.set_release_details(obj);
        conn.then(
            function(response){
                if(response.status == 200 || 201 || 202 || 203 || 204){
                    alert('RELEASE-DETAILS-SET');
                }else{
                	alert('RELEASE-NOT-SET');
                }
            },
            function(error){
            	alert('RELEASE-NOT-SET:ERROR');
            }
        );
    };
    
    $scope.updateComments = function(){
    	var obj = {
    		shipment_id:parseInt($scope.FILTER_DATA.shipment_id),
    		creator_id : $scope.CURRENT_USER.id,
    		color:$scope.FILTER_DATA.color,
    		status:$scope.FILTER_DATA.status,
    		comment:$scope.FILTER_DATA.comment,
    		remarks:$scope.FILTER_DATA.remarks
    	};
    	var conn = GServices.update_comments(obj);
        conn.then(
            function(response){
                if(response.status == 200 || 201 || 202 || 203 || 204){
                    alert('COMMENTS-SET');
                }else{
                	alert('COMMENTS-SET');
                }
            },
            function(error){
            	alert('COMMENTS:ERROR');
            }
        );
    };

    var init = function(){
    	//$scope.get_payment_receipt_bundles();
    };
    init();

}]);