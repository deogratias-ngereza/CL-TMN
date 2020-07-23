/**
 * #grand123grand1@gmail
 * EASY LOGGING ON BROWSER
 * set from constrants
 */
APP.factory("GDumpService", ["$rootScope", "APP_LOGGING",
    function($rootScope, APP_LOGGING) {

        var OBJ = {};

        OBJ.log = function(option, status, msg) {
            //options 0  and 1 0 -> default, 1 -> individual
            if (option == 1) {
                console.log(msg);
            } else {
                //check global options
                if (APP_LOGGING == true) {
                    console.log(msg);
                }
            }

        };
        return OBJ;
    }
]);

/*
*COOKIE MANAGER
*/
APP.factory("CookieManagerService",["BASE_SERVER_URL","$cookies",
function(BASE_SERVER_URL,$cookies){
    var OBJ = {};
    var now = new Date();
    var expiresValue = new Date(now);//for cookies
    var expTimeOne = expiresValue.setSeconds(now.getSeconds() + 86400); //in 24 hrs
    var expTimeTwo = expiresValue.setSeconds(now.getSeconds() + 604800); //in 1week

    //CENTER_INFO
    OBJ.saveCenterInfo = function(data){
        $cookies.putObject("CL_FIN_CENTER_INFO",data,{ 'expires.toUTCString': expTimeTwo });
        console.log("CL_FIN_CENTER_INFO",$cookies.getObject("CL_FIN_CENTER_INFO"));
    };
    OBJ.getCenterInfo = function(){
        return $cookies.getObject("CL_FIN_CENTER_INFO");
    };
    //STORE VENDORS
    OBJ.saveVendorsList = function(data){
        $cookies.putObject("CL_CS_VENDORS_LIST",data,{ 'expires.toUTCString': expTimeTwo });
        console.log("CL_CS_VENDORS_LIST",$cookies.getObject("CL_CS_VENDORS_LIST"));
    };
    OBJ.getVendorsList = function(){
        return $cookies.getObject("CL_CS_VENDORS_LIST");
    };


     //COMPANY INFO
    OBJ.saveCompanyInfo = function(data){
        $cookies.putObject("CL_FIN_COMPANY_INFO",data,{ 'expires.toUTCString': expTimeTwo });
        console.log("CL_FIN_COMPANY_INFO",$cookies.getObject("CL_FIN_COMPANY_INFO"));
    };
    OBJ.getCompanyInfo = function(){
        return $cookies.getObject("CL_FIN_COMPANY_INFO");
    };

     //DEPARTMENT INFO
    OBJ.saveDepartmentInfo = function(data){
        $cookies.putObject("CL_FIN_DEPARTMENT_INFO",data,{ 'expires.toUTCString': expTimeTwo });
        console.log("CL_FIN_DEPARTMENT_INFO",$cookies.getObject("CL_FIN_DEPARTMENT_INFO"));
    };
    OBJ.getDepartmentInfo = function(){
        return $cookies.getObject("CL_FIN_DEPARTMENT_INFO");
    };
     //ACCESS-ROLES
    OBJ.saveACInfo = function(data){
        $cookies.putObject("CL_FIN_AC_INFO",data,{ 'expires.toUTCString': expTimeTwo });
        console.log("CL_FIN_AC_INFO",$cookies.getObject("CL_FIN_AC_INFO"));
    };
    OBJ.getACInfo = function(){
        return $cookies.getObject("CL_FIN_AC_INFO");
    };


    //general filters
    OBJ.saveGeneralFilters = function(data){
        $cookies.putObject("CL_CS_GEN_FILTERS",data,{ 'expires.toUTCString': expTimeTwo });
        console.log("CL_CS_GEN_FILTERS",$cookies.getObject("CL_CS_GEN_FILTERS"));
    };
    OBJ.getGeneralFilters = function(){
        return $cookies.getObject("CL_CS_GEN_FILTERS");
    };


    return OBJ;
}]);




/**
 * #grand123grand1@gmail.APP
 * LOGIN/COOKIEs & USER MANAGEMENT
 */

APP.factory("AuthService",["$rootScope","$http","BASE_SERVER_URL","$cookies","$location","$window",
function($rootScope,$http,BASE_SERVER_URL,$cookies,$location,$window){

    var OBJ = {};
    var now = new Date();
    var expiresValue = new Date(now);//for cookies

    var expTimeOne = expiresValue.setSeconds(now.getSeconds() + 86400); //in 24 hrs
    var expTimeTwo = expiresValue.setSeconds(now.getSeconds() + 604800); //in 1week

    OBJ.test = function(){
        console.log("test_ function");
    };

    //post login
    OBJ.postLogin = function(_data){
        //return $http.post(BASE_SERVER_URL + "api-v1/login",_data);
        return $http({
            url     : BASE_SERVER_URL + "api-v1/login",
            method  : 'POST',
            data    : _data, 
            headers : {'Content-Type': 'application/json'},
            withCredentials: true
        });
    };
    OBJ.postLoginByAccount = function(_data){
        return $http.post(BASE_SERVER_URL + "/api-auth-v1/login_by_account",_data);
    };

    //post login
    OBJ.resetPassword = function(_data){
        return $http.post(BASE_SERVER_URL + "/api-v1/reset_password",_data);
    };

    //retrieve user from cookie
    OBJ.getCurrentUser = function(){
        return $cookies.getObject("CL_FIN_APP_CUR_USER");
    };
    //save user to the cookie
    OBJ.saveCurrentUser = function(data){
        $cookies.putObject("CL_FIN_APP_CUR_USER",data,{ 'expires.toUTCString': expTimeTwo });
		console.log("USER SAVED:",$cookies.getObject("CL_FIN_APP_CUR_USER"));
    };
    //save web token to the cookie
    OBJ.saveCurrentWebToken = function(data){
        $cookies.putObject("CL_FIN_APP_WEB_TOKEN",data,{ 'expires.toUTCString': expTimeTwo });
        //$http.defaults.headers.APPmon.Authorization = 'Bearer ' + data;//http://jasonwatmore.APP/post/2016/04/05/angularjs-jwt-authentication-example-tutorial
		console.log("WEB TOKEN SAVED:",$cookies.getObject("CL_FIN_APP_WEB_TOKEN"));
    };
    //get web token to the cookie
    OBJ.getCurrentWebToken = function(){
        return $cookies.getObject("CL_FIN_APP_WEB_TOKEN");
    };

    //logout the user..
    OBJ.logout = function(){
        $cookies.remove("CL_FIN_APP_WEB_TOKEN");
        $cookies.remove("CL_FIN_CENTER_INFO");
        $cookies.remove("CL_FIN_APP_CUR_USER");
        $cookies.remove("CL_FIN_GEN_FILTERS");
        $cookies.remove("CL_FIN_DEPARTMENT_INFO");
        $cookies.remove("CL_FIN_COMPANY_INFO");
        $cookies.remove("CL_FIN_APP_TOKEN");
        $cookies.remove("CL_FIN_VENDORS_LIST");
        $cookies.remove("CL_FIN_AC_INFO");
    };
    //redirect to the login page
    OBJ.goToLoginPage = function(){
        $window.location.href = BASE_SERVER_URL;
    };



    //this can be modified by user thats y we keep on checking it..
    OBJ.getBaseURLOfCurrentViewingPage = function(){
        var url = $location.absUrl().split('?')[0];
        var arr = url.split('#');
        return arr[0];
    };

  
    //retrieve CSRF token from server..
    OBJ.goFindCSRFToken = function (){
        return $http.get(BASE_SERVER_URL + "api-v1/get_free_token/");
    };


  
    //save token to the cookie
    OBJ.saveCurrentToken = function(data){
        $cookies.putObject("CL_FIN_APP_TOKEN",data,{ 'expires.toUTCString': expTimeTwo });
		console.log("TOKEN SAVED:",$cookies.getObject("CL_FIN_APP_TOKEN"));
    };
    //get token to the cookie
    OBJ.getCurrentToken = function(){
        return $cookies.getObject("CL_FIN_APP_TOKEN");
    };

    
    //redirect to the login page
    OBJ.goToLoginPage = function(){
        $window.location.href = BASE_SERVER_URL;
    };



    //get access to the current user api
    OBJ.getCurrentUserAPI = function(){
        return $http.get(BASE_SERVER_URL + "api-v1/get_profile/" + OBJ.getCurrentUser().id);
    };


    return OBJ;
}]);





/**
 * ALL API MATCHING ROUTES
 */
APP.factory("GServices", ["$rootScope", "$http", "APP_LOGGING", "BASE_SERVER_URL",
    function($rootScope, $http, APP_LOGGING, BASE_SERVER_URL) {

        var OBJ = {};



        OBJ.get_summary = function() {  return $http.get(BASE_SERVER_URL + '/api-cl-tmn/assignment_summary', { cache: false });  };
       
        OBJ.filter_assignments = function(data) { return $http.post(BASE_SERVER_URL + '/api-cl-tmn/filter_assignments',data);  };
        OBJ.get_vendors = function() {  return $http.get(BASE_SERVER_URL + '/api-cl-tmn/vendors', { cache: true });  };
       

        OBJ.get_min_awb_info = function(data) { return $http.post(BASE_SERVER_URL + '/api-cl-tmn/min_awb_info',data);  };
        OBJ.get_workers_cs = function() {  return $http.get(BASE_SERVER_URL + '/api-cl-tmn/get_workers_cs', { cache: true });  };
        OBJ.set_assignments = function(data) { return $http.post(BASE_SERVER_URL + '/api-cl-tmn/set_assignments',data);  };
        






       /* OBJ.filter_payment_collections = function(data) {  return $http.post(BASE_SERVER_URL + '/api-cl-finance/filter_payment_collections', data);  };   
        OBJ.change_payment_status = function(data) { return $http.post(BASE_SERVER_URL + '/api-cl-finance/change_payment_collection_status',data);  };
        

        OBJ.get_tabulation_requests_filter = function(data) { return $http.post(BASE_SERVER_URL + '/api-cl-manager/tabulation_requests_filter', data);  };
        //
        OBJ.txdt_filter = function(data) { return $http.post(BASE_SERVER_URL + '/api-cl-manager/txdt_filter', data);  };
        
         //
        OBJ.add_duty_and_tax_payment_entry = function(data) { return $http.post(BASE_SERVER_URL + '/api-cl-manager/add_duty_and_tax_payment_entry', data);  };
        


         //filter awaiting payment list
        OBJ.filter_awaiting_payment_list = function($sd,$ed) {  return $http.get(BASE_SERVER_URL + '/api-cl-manager/filter_awaiting_payment_list?stmnt_date='+$sd+'&end_date='+$ed, { cache: false });  };
        OBJ.update_awaiting_list = function(id,data) { return $http.post(BASE_SERVER_URL + '/api-cl-manager/update_awaiting_list/'+id,data);  };
        
        




        
         
     


        OBJ.filter_declared_shipments = function(data) {  return $http.post(BASE_SERVER_URL + "/api-cl-finance/declared_shipments_filter?option=view",data);  };
        OBJ.get_payment_receipt_bundles = function() {  return $http.get(BASE_SERVER_URL + '/api-cl-finance/get_payment_receipt_bundles', { cache: true });  };
        
        
        OBJ.receive_payments = function(data) {  return $http.post(BASE_SERVER_URL + "/api-cl-finance/receive_payments",data);  };
        
        OBJ.search_broker = function(key) {  return $http.get(BASE_SERVER_URL + '/api-cl-finance/brokers_search?key=' + key, { cache: true });  };
        


        OBJ.set_awb_broker = function(data) {  return $http.post(BASE_SERVER_URL + "/api-cl-finance/set_awb_broker",data);  };
        OBJ.set_collection_details = function(data) {  return $http.post(BASE_SERVER_URL + "/api-cl-finance/set_collection_details",data);  };
        OBJ.set_release_details = function(data) {  return $http.post(BASE_SERVER_URL + "/api-cl-finance/set_release_details",data);  };
        OBJ.update_comments = function(data) {  return $http.post(BASE_SERVER_URL + "/api-cl-finance/update_comments",data);  };
        



         
        //list of payment_collections
        OBJ.get_payment_collections = function() {  return $http.get(BASE_SERVER_URL + '/api-cl-finance/payment_collections', { cache: false });  };
        //find payment_collection from id
        OBJ.get_single_payment_collection = function(data) {  return $http.get(BASE_SERVER_URL + '/api-cl-finance/payment_collections_find/' + data.id, { cache: false });  };
        //delete payment_collection
        OBJ.post_payment_collection_delete = function(data) { return $http.delete(BASE_SERVER_URL + '/api-cl-finance/payment_collections_delete/' + data.id);  };
        //insert payment_collection
        OBJ.post_payment_collection_insert = function(data) { return $http.post(BASE_SERVER_URL + '/api-cl-finance/payment_collections_insert', data);  };
        //update payment_collection
        OBJ.post_payment_collection_update = function(data) {  return $http.put(BASE_SERVER_URL + '/api-cl-finance/payment_collections_update/' + data.id , data);  };
        //delete payment_collection
        OBJ.get_payment_collection_search = function(data) {  return $http.get(BASE_SERVER_URL + '/api-cl-finance/payment_collections_search?id=' + data.key, { cache: true });  };







        //list of clients
        OBJ.get_clients = function() {  return $http.get(BASE_SERVER_URL + '/api-cl-cbx/clients', { cache: false });  };
        
      

        //list of branches
        OBJ.get_branches = function() {  return $http.get(BASE_SERVER_URL + '/api-cl-cbx/branches', { cache: false });  };
        
*/
        

        

        return OBJ;
    }
]);




/*
* HELPEr FUNCTION
*/
APP.factory("HelperService",[function(){
    var OBJ = {};
    OBJ.cloneObject = function(obj) {
        var clone = {};
        for(var i in obj) {
            if(obj[i] != null &&  typeof(obj[i])=="object")
                clone[i] = OBJ.cloneObject(obj[i]);
            else
                clone[i] = obj[i];
        }
        return clone;
    };
    OBJ.getCurrentTime = function(){
         var today = new Date();
         return today.getHours() + ":" + today.getMinutes();
    };
    OBJ.getCurrentDate = function(format){
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!

        var yyyy = today.getFullYear();
        if(dd<10){
            dd='0'+dd;
        } 
        if(mm<10){
            mm='0'+mm;
        } 
        switch(format){
            case "dd-mm-yyyy" : 
                var today = dd+'-'+mm+'-'+yyyy;
                return today;
                break;
            case "yyyy-mm-dd" : 
                var today = yyyy+'-'+mm+'-'+dd;
                return today;
                break;
            case "dd/mm/yyyy" : 
                var today = dd+'/'+mm+'/'+yyyy;
                return today;
                break;
            case "ddmmyyyy" : 
                var today = dd+''+mm+''+yyyy;
                return today;
                break;

            case "yyyymmdd" : 
                var today = yyyy+'-'+mm+'-'+dd;
                return today;
                break;
        }
        
    };

    OBJ.getWeekDayName = function($xDate,format){
        if(format == "long"){
            var mydate = $xDate + "T00:00:00";
            var weekDayName =  moment(mydate).format('dddd');
            console.log(weekDayName);
            return weekDayName;
        }else{
            var mydate = $xDate + "T00:00:00";
            var weekDayName =  moment(mydate).format('ddd');
            console.log(weekDayName);
            return weekDayName;
        }
    };
    OBJ.getRemainedDurationFromNowPeriod = function($xDate){
        var now = moment(new Date());
        var a = moment($xDate);//now
        var b = moment(now);
        var rem_minutes = a.diff(b, 'minutes');
        var rem_hrs = a.diff(b, 'hours');
        var rem_days = a.diff(b, 'days');
        var rem_weeks = a.diff(b, 'weeks');
        var rem_months = a.diff(b, 'months');

        if(rem_months > 0 ) return rem_months + ' month'+(rem_months > 1? 's':'') +' remained.';
        else if(rem_weeks > 0 ) return rem_weeks + ' week'+(rem_weeks > 1? 's':'') +' remained.';
        else if(rem_days > 0 ) return rem_days + ' day'+(rem_days > 1? 's':'') +' remained.';
        else if(rem_hrs > 0 ) return rem_hrs + ' hour'+(rem_hrs > 1? 's':'') +' remained.';
        else if(rem_minutes > 0 ) return rem_minutes + ' minute'+(rem_minutes > 1? 's':'') +' remained.';
        else return 0 + ' days remained.';
    };
    OBJ.getPastDurationFromNowPeriod = function($xDate){
        var now = moment(new Date());
        var a = moment($xDate);//now
        var b = moment(now);
        var rem_minutes = b.diff(a, 'minutes');
        var rem_hrs = b.diff(a, 'hours');
        var rem_days = b.diff(a, 'days');
        var rem_weeks = b.diff(a, 'weeks');
        var rem_months = b.diff(a, 'months');
        //console.log($xDate + " ==> MINS : " +  rem_minutes);
        //console.log($xDate + " ==> HRS : " +  rem_hrs);

        if(rem_months > 0 ) return rem_months + ' Month'+(rem_months > 1? 's':'') +' Ago.';
        else if(rem_weeks > 0 ) return rem_weeks + ' Week'+(rem_weeks > 1? 's':'') +' Ago.';
        else if(rem_days > 0 ) return rem_days + ' Day'+(rem_days > 1? 's':'') +' Ago.';
        else if(rem_hrs > 0 ) return rem_hrs + ' Hour'+(rem_hrs > 1? 's':'') +' Ago.';
        else if(rem_minutes > 0 ) return rem_minutes + ' Minute'+(rem_minutes > 1? 's':'') +' Ago.';
        else return 0 + ' days Ago.';
    };
    OBJ.getTokenCode = function(length){
        //edit the token allowed characters
        //abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890
        var a = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
        var b = [];  
        for (var i=0; i<length; i++) {
            var j = (Math.random() * (a.length-1)).toFixed(0);
            b[i] = a[j];
        }
        return b.join("");
    };
    OBJ.getUserAccountNo = function(length){
        //edit the token allowed characters
        //abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890
        var a = "1234567890".split("");
        //var a = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
        var b = [];  
        for (var i=0; i<length; i++) {
            var j = (Math.random() * (a.length-1)).toFixed(0);
            b[i] = a[j];
        }
        return b.join("");
    };

    //convert number into words 
    OBJ.num2Words = function(n){
        if(n == ""){
            return "";
        }

        var string = n.toString(), units, tens, scales, stmnt, end, chunks, chunksLen, chunk, ints, i, word, words, and = 'and';

        /* Remove spaces and commas */
        string = string.replace(/[, ]/g,"");

        /* Is number zero? */
        if( parseInt( string ) === 0 ) {
            return 'zero';
        }
        
        /* Array of units as words */
        units = [ '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen' ];
        
        /* Array of tens as words */
        tens = [ '', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety' ];
        
        /* Array of scales as words */
        scales = [ '', 'thousand', 'million', 'billion', 'trillion', 'quadrillion', 'quintillion', 'sextillion', 'septillion', 'octillion', 'nonillion', 'decillion', 'undecillion', 'duodecillion', 'tredecillion', 'quatttuor-decillion', 'quindecillion', 'sexdecillion', 'septen-decillion', 'octodecillion', 'novemdecillion', 'vigintillion', 'centillion' ];
        
        /* Split user arguemnt into 3 digit chunks from right to left */
        stmnt = string.length;
        chunks = [];
        while( stmnt > 0 ) {
            end = stmnt;
            chunks.push( string.slice( ( stmnt = Math.max( 0, stmnt - 3 ) ), end ) );
        }
        
        /* Check if function has enough scale words to be able to stringify the user argument */
        chunksLen = chunks.length;
        if( chunksLen > scales.length ) {
            return '';
        }
        
        /* Stringify each integer in each chunk */
        words = [];
        for( i = 0; i < chunksLen; i++ ) {
            
            chunk = parseInt( chunks[i] );
            
            if( chunk ) {
                
                /* Split chunk into array of individual integers */
                ints = chunks[i].split( '' ).reverse().map( parseFloat );
            
                /* If tens integer is 1, i.e. 10, then add 10 to units integer */
                if( ints[1] === 1 ) {
                    ints[0] += 10;
                }
                
                /* Add scale word if chunk is not zero and array item exists */
                if( ( word = scales[i] ) ) {
                    words.push( word );
                }
                
                /* Add unit word if array item exists */
                if( ( word = units[ ints[0] ] ) ) {
                    words.push( word );
                }
                
                /* Add tens word if array item exists */
                if( ( word = tens[ ints[1] ] ) ) {
                    words.push( word );
                }
                
                /* Add 'and' string after units or tens integer if: */
                if( ints[0] || ints[1] ) {
                    
                    /* Chunk has a hundreds integer or chunk is the first of multiple chunks */
                    if( ints[2] || ! i && chunksLen ) {
                        words.push( and );
                    }
                
                }
                
                /* Add hundreds word if array item exists */
                if( ( word = units[ ints[2] ] ) ) {
                    words.push( word + ' hundred' );
                }
                
            }
            
        }
        
        return words.reverse().join( ' ' );
        

            
    };

    return OBJ;
}]);






/**
 * XLS SERVICES
 */
/*
APP.factory("GXLSService",["$rootScope",
function($rootScope){
    var OBJ = {};
    OBJ.test = function(obj){
        alasql("CREATE TABLE cities (city string, population number)");
        alasql("INSERT INTO cities VALUES ('Rome',2863223),('Paris',2249975),('Berlin',3517424),('Madrid',3041579)");
        var res = alasql("SELECT * FROM cities");
        alasql('SELECT * INTO XLSX("<table_name>.xlsx",{headers:true}) FROM ?',[res]);
    };
   //overview function..
   OBJ.getExcelAPPOverview = function(xlsName,obj){
        alasql("CREATE TABLE <table_name> (id string, sale number, APPmission_value number)");
        //alasql("INSERT INTO <table_name> VALUES ('0',1000,0.2)");
        var services = obj.services;
        for(sev in services){
            console.log(sev);
            var cur_service = services[sev];
            var no_of_trans = Object.keys(cur_service).length;
            for(i = 0; i < no_of_trans;i++){
                alasql("INSERT INTO <table_name> VALUES (" + cur_service[i].ID + "," + cur_service[i].SALE + "," + cur_service[i].APPMISSION + ")");
            }
        }
        var res = alasql("SELECT * FROM <table_name>");
        alasql('SELECT * INTO XLSX("<table_name>.xlsx",{headers:true}) FROM ?',[res]);
        //console.log(res);
    };

    return OBJ;
}]);
*/






