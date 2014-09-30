module.exports = ['$rootScope', '$location', 'Authentication', function($rootScope, $location, Authentication){

    $rootScope.signedin = Authentication.getSigninStatus();

    var switchToSignedin = function(){
        $rootScope.signedin = true;
        $location.path('/');
    };

    var switchToSignedoutAndShowSigninPage = function(){
        $rootScope.signedin = false;
        $location.path('/signin');
    };

    $rootScope.$on('event:authentication:signin:succeeded', function(){
        switchToSignedin();
    });

    $rootScope.$on('event:authentication:signin:failed', function(){
        switchToSignedoutAndShowSigninPage();
    });

    $rootScope.$on('event:authentication:signout:succeeded', function(){
        $rootScope.signedin = false;
        $location.path('/');
    });

    $rootScope.$on('event:unauthorized', function(){
        switchToSignedoutAndShowSigninPage();
    });

}];
