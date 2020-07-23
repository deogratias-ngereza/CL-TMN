APP.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
    function($stateProvider, $urlRouterProvider, $locationProvider) {

        $urlRouterProvider.otherwise('/');

        $stateProvider

            .state('login', {
            url: '/', 
            templateUrl: 'dist/ng/views/login.html',
            controller : 'AuthController'

        })



        .state('app', {
            url: '/app',
            views: {
                '': { templateUrl: 'dist/ng/views/layout.html',controller:'MainAppController' },
                'contents@app': { templateUrl: 'dist/ng/views/intro.html' }
            }
        })

        .state('app.assignments', {
            url: '/assignments/:category/:assigned_status/:user_id/:start_date/:end_date/:username',
            views: {
                'contents@app': {  templateUrl: './dist/ng/views/assignments.html',controller:'AssignmentFilterController' }
            }
        }) 
        .state('app.manual_assign', {
            url: '/manual_assign',
            views: { 
                'contents@app': {  templateUrl: './dist/ng/views/manual_assign.html',controller:'ManualAssignController' }
            }
        }) 
        .state('app.summary', {
            url: '/summary',
            views: { 
                'contents@app': {  templateUrl: './dist/ng/views/summary.html',controller:'SummaryController' }
            }
        })  



       /* .state('app.dashboard', {
            url: '/dashboard',
            views: {
                'contents@app': {  templateUrl: './dist/ng/views/dashboard.html',controller:'DashboardController' }
            }
        })
        .state('app.shipment_filter', {
            url: '/shipment_filter/:start_date/:end_date/:awb_no',
            views: {
                'contents@app': {  templateUrl: './dist/ng/views/shipment_filter.html',controller:'ShipmentFilterController' }
            }
        })
        
        .state('app.receive_payments', { 
            url: '/receive_payments/:broker_ship_entry_id/:shipment_id/:awb_no', 
            views: {
                'contents@app': {  templateUrl: './dist/ng/views/receive_payments.html',controller:'ReceivePaymentController' }
            }
        })
        .state('app.status_changer', { 
            url: '/status_changer/:shipment_id/:awb_no', 
            views: {
                'contents@app': {  templateUrl: './dist/ng/views/status_changer.html',controller:'StatusChangerController' }
            }
        })
        .state('app.payment_collections', { 
            url: '/payment_collections', 
            views: {
                'contents@app': {  templateUrl: './dist/ng/views/payment_collections.html',controller:'PaymentCollectionController' }
            }
        })
        .state('app.tabulations_requests', {
            url: '/tabulations_requests/:vendor_id/:lh_value/:bill_option/:start_dt/:end_dt',
            views: {
                'contents@app': {  templateUrl: './dist/ng/views/pages/tabulations_requests/tabulations_requests.html',controller : 'TabulationReqController' }
            }
        })
        .state('app.tnd_payment_list', {
            url: '/tnd_payment_list/:vendor_id/:lh_value/:bill_option/:start_dt/:end_dt',
            views: {
                'contents@app': {  templateUrl: './dist/ng/views/pages/payment_list/tnd_payment_list.html',controller : 'TXDTPaymentListController' }
            }
        })

        //needs to be verified
        .state('app.awaiting_cs_payments', { 
            url: '/awaiting_cs_payments', 
            views: {
                'contents@app': {  templateUrl: './dist/ng/views/pages/awaiting_payments/awaiting_cs_payments.html',controller:'AwaitingPaymentListController' }
            }
        })

        //
       
        
        

        /*********************************************  GENERATED ****************************************************
        
         //licence ui
        .state('app.licence', {
            url: '/licence',
            views: {
                'contents@app': {  templateUrl: './dist/ng/views/licence.html' }
            }
        })

        
		//clients route
        .state('app.clients', {
            url: '/clients',
            views: {
                'contents@app': {  templateUrl: './dist/ng/views/pages/clients/clients.html',controller:'ClientController' }
            }
        })       
        
		//departments route
        .state('app.departments', {
            url: '/departments',
            views: {
                'contents@app': {  templateUrl: './dist/ng/views/pages/departments/departments.html',controller:'DepartmentController' }
            }
        })       
        
		//branches route
        .state('app.branches', {
            url: '/branches',
            views: {
                'contents@app': {  templateUrl: './dist/ng/views/pages/branches/branches.html',controller:'BranchController' }
            }
        })       
        
		//access_controls route
        .state('app.access_controls', {
            url: '/access_controls',
            views: {
                'contents@app': {  templateUrl: './dist/ng/views/pages/access_controls/access_controls.html',controller:'AccessControlController' }
            }
        }) 
        .state('app.unit_access_controls', {
            url: '/unit_access_controls/:unit_id/:unit_name',
            views: {
                'contents@app': {  templateUrl: './dist/ng/views/pages/access_controls/unit_access_controls.html',controller:'UnitAccessControlController' }
            }
        })       
        
		//units route
        .state('app.units', {
            url: '/units',
            views: {
                'contents@app': {  templateUrl: './dist/ng/views/pages/units/units.html',controller:'UnitController' }
            }
        })       
        
		//users route
        .state('app.users', {
            url: '/users',
            views: {
                'contents@app': {  templateUrl: './dist/ng/views/pages/users/users.html',controller:'UserController' }
            }
        })       
        
		//company_info route
        .state('app.company_info', {
            url: '/company_info',
            views: {
                'contents@app': {  templateUrl: './dist/ng/views/pages/company_info/company_info.html',controller:'CompanyInfoController' }
            }
        })  

        //flight_carriers route
        .state('app.flight_carriers', {
            url: '/flight_carriers',
            views: {
                'contents@app': {  templateUrl: './dist/ng/views/pages/flight_carriers/flight_carriers.html',controller:'FlightCarrierController' }
            }
        })   

             
        
        /********************************************* / GENERATED ****************************************************
        //requests from clients
        .state('app.requests', {
            url: '/requests',
            views: {
                'contents@app': { templateUrl: 'dist/ng/views/customers_requests.html' }
            }
        })
        //list of purposes
        .state('app.purposes', {
            url: '/purposes',
            views: {
                'contents@app': { templateUrl: 'dist/ng/views/list_of_purposes.html' }
            }
        })
        //new purposes 
        .state('app.new_purpose', {
            url: '/new_purpose',
            views: {
                'contents@app': { templateUrl: 'dist/ng/views/new_purpose.html' }
            }
        })

        //profile
        .state('app.profile', {
            url: '/profile',
            views: {
                'contents@app': { templateUrl: 'dist/ng/views/profile.html' }
            }
        })



*/







        //load all other shared routes here ..   

        ; //closing of the stateProvider..
    }
]);


APP.config(["$locationProvider", function($locationProvider) {
    $locationProvider.hashPrefix('%#');
}]);