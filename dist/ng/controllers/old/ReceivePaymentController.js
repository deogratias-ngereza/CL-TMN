
APP.controller('ReceivePaymentController', ['$timeout','$scope','$stateParams','$state','AuthService','BASE_SERVER_URL','CookieManagerService','GServices','HelperService','GDumpService',
 function($timeout,$scope,$stateParams,$state,AuthService,BASE_SERVER_URL,CookieManagerService,GServices,HelperService,GDumpService) {
 	$scope.IS_LOADING = true;
    $scope.LOADING_MSG = "Loading ...";

 	$scope.TODAYS_DATE = HelperService.getCurrentDate('yyyy-mm-dd');
 	$scope.CURRENT_USER = $scope.$parent.CURRENT_USER;
    $scope.COMPANY_INFO = $scope.$parent.COMPANY_INFO;

    $scope.RECEIPT_DATA = {
    	broker_ship_entry_id : $stateParams.broker_ship_entry_id,
    	branch_id : $scope.CURRENT_USER.branch_id,
    	creator_id : $scope.CURRENT_USER.id,
    	shipment_id: $stateParams.shipment_id,
        currency : '',
        receipt_no:'',
        batch_no : HelperService.getCurrentDate('ddmmyyyy') + HelperService.getTokenCode(4),
        awb_no : $stateParams.awb_no,
        paid_by : '',
        payment_mode_id : -1,
        total_amount : 0,
        payable_services : []//it will be overridden by payment mode
    };

    $scope.PAYMENT_RECEIPT_BUNDLES = {};

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

    $scope.calculate = function(){
    	var total = 0;
    	for(i = 0; i < $scope.PAYMENT_RECEIPT_BUNDLES.payable_services.length;i++){
    		var service = $scope.PAYMENT_RECEIPT_BUNDLES.payable_services[i];

    		total += service.amount;
    	}
    	$scope.RECEIPT_DATA.total_amount = total;
    };


    $scope.receive_payments = function(){
    	$scope.RECEIPT_DATA.payable_services = $scope.PAYMENT_RECEIPT_BUNDLES.payable_services;
    	//console.log($scope.RECEIPT_DATA)
    	 $scope.change_loading_status(true,"POSTING PAYMENTS ...");
    	var conn = GServices.receive_payments($scope.RECEIPT_DATA);
        conn.then(
            function(response){
                $scope.IS_LOADING = false;
                if(response.status == 200 || 201 || 202 || 203 || 204){
                    //$scope.PAYMENT_RECEIPT_BUNDLES = response.data.msg_data;//response.data;
                	//$scope.RECEIPT_DATA.currency = $scope.PAYMENT_RECEIPT_BUNDLES.currency_code;
                }else{
                }
            },
            function(error){
            }
        );

    };

 	$scope.get_payment_receipt_bundles = function(){
        var conn = GServices.get_payment_receipt_bundles();
        conn.then(
            function(response){
                $scope.IS_LOADING = false;
                if(response.status == 200 || 201 || 202 || 203 || 204){
                    $scope.PAYMENT_RECEIPT_BUNDLES = response.data.msg_data;//response.data;
                	$scope.RECEIPT_DATA.currency = $scope.PAYMENT_RECEIPT_BUNDLES.currency_code;
                }else{
                }
            },
            function(error){
            }
        );
    };

    var init = function(){
    	$scope.get_payment_receipt_bundles();
    };
    init();

}]);