var APP = angular
.module("APP",
    //load all the dependent modules here..

    [
        'ui.router',
        'ngCookies',
        'datatables',
        'datepicker',
        //'ngclipboard'
    ]

);


APP.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});
APP.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });
    };
});


/*
* edit text length
* [[some_text | cut:true:100:' ...']]  [[]] ==> angular braces
*/
APP.filter('cut', function () {
    return function (value, wordwise, max, tail) {
        if (!value) return '';

        max = parseInt(max, 10);
        if (!max) return value;
        if (value.length <= max) return value;

        value = value.substr(0, max);
        if (wordwise) {
            var lastspace = value.lastIndexOf(' ');
            if (lastspace !== -1) {
              //Also remove . and , so its gives a cleaner result.
              if (value.charAt(lastspace-1) === '.' || value.charAt(lastspace-1) === ',') {
                lastspace = lastspace - 1;
              }
              value = value.substr(0, lastspace);
            }
        }

        return value + (tail || ' …');
    };
});



//remove rejection error
APP.config(['$qProvider', function($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}]);
APP.filter('unsafe', function($sce) {
   return function(val) {
      return $sce.trustAsHtml(val);
   };
});



APP.run(function($rootScope) {
    $rootScope.$on('$stateChangeStart', function() {
        
        $rootScope.IS_LOADING = true;
        $rootScope.LOADING_MSG = "please wait ...";
        console.log("[ -- STATE CHANGED -- ] loader=> " + $rootScope.IS_LOADING);

    });
});




/**
 * on change route remove all suspended requests
 * =>http://stackoverflow.APP/questions/25300473/cancel-abort-all-pending-requests-in-angularjs
 */


/*APP.config(function($httpProvider) {
    $httpProvider.interceptors.push(function($q) {
        return {
            request: function(config) {
                if (!config.timeout) {
                    config.cancel = $q.defer();
                    config.timeout = config.cancel.promise;
                }

                return config;
            }
        }
    });
});

APP.run(function($rootScope, $http) {
    $rootScope.$on('$stateChangeStart', function() {
        $http.pendingRequests.forEach(function(pendingReq) {
            if (pendingReq.cancel) {
                pendingReq.cancel.resolve('Cancel!');
            }
        });
    });
});
*/


/**
 * Check if user is login
 *  
 */


APP.run(function($rootScope, $location, $state, AuthService, BASE_URL, $window) {
    $rootScope.$on('$stateChangeStart',
        function(event, toState, toParams, fromState, fromParams) {
            // do something
            if (AuthService.getCurrentUser() == undefined || AuthService.getCurrentWebToken() == undefined) {
                if (toState.name != "login") {
                    event.preventDefault(); // stop current execution
                    $state.go('login'); // go to login
                    //$window.location.href = BASE_URL;
                    console.log(" in login:");
                }
                if (toState.name != "app") {
                    $rootScope.sidebar_image_status = 0; //for side bar image
                } else {
                    $rootScope.sidebar_image_status = 1; //for side bar image
                }
            }
            //console.log("route change");
        });

});


/**
 * http://stackoverflow.APP/questions/32925642/materialize-button-inside-ng-repeat-not-triggering-modal
 * ng-repeate with modal in materialize
 */
/*
APP.directive('repeatDone', function() {
    return function(scope, element, attrs) {
        if (scope.$last) { // all are rendered
            scope.$eval(attrs.repeatDone);
        }
    }
});
*/


/**
 *   Add CSRF oR BEARER TOKEN every time u send HTTP REQUEST
 *   //https://gist.github.APP/antoniocapelo/96c3d7989cf19a4f49e4
 * 
 */


APP.factory('BearerAuthInterceptor', function($window, $q, $cookies) {
    return {
        request: function(config) {
            config.headers = config.headers || {};
            if ($cookies.getObject("APP_WEB_TOKEN") != undefined) {
                // may also use sessionStorage
                config.headers.Authorization = 'Bearer ' + $cookies.getObject("APP_WEB_TOKEN");
            }
            return config || $q.when(config);
        },
        response: function(response) {
            if (response.status === 401) {
                //  Redirect user to login page / signup Page.
            }
            return response || $q.when(response);
        }
    };
});


// Register the previously created AuthInterceptor.
/*APP.config(function($httpProvider) {
    $httpProvider.interceptors.push('BearerAuthInterceptor');
});*/

/**
 * end token modifier
 */



/*
  //for put a cursor to the req field
  https://gist.github.APP/mlynch/dd407b93ed288d499778
*/
/*

APP.directive('autofocus', ['$timeout', function($timeout) {
    return {
        restrict: 'A',
        link: function($scope, $element) {
            $timeout(function() {
                $element[0].focus();
            });
        }
    }
}]);
*/

/*
APP.directive('innerHtmlBind', function() {
  return {
    restrict: 'A',
    scope: {
      inner_html: '=innerHtml'
    },
    link: function(scope, element, attrs) {
      scope.inner_html = element.html();
    }
  }
});
*/




/*

//http://stackoverflow.APP/questions/14712223/how-to-handle-anchor-hash-linking-in-angularjs
APP.directive('scrollTo', function($location, $anchorScroll) {
    return function(scope, element, attrs) {

        element.bind('click', function(event) {
            event.stopPropagation();
            var off = scope.$on('$locationChangeStart', function(ev) {
                off();
                ev.preventDefault();
            });
            var location = attrs.scrollTo;
            $location.hash(location);
            $anchorScroll();
        });

    };
});

*/