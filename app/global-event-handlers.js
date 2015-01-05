module.exports = ['$rootScope', '$location', 'Authentication', 'Session', function($rootScope, $location, Authentication, Session){

    var setSessionDataToRootScope = function(){
        var sessionData = Session.getSessionData();
        $rootScope.userName = sessionData.userName;
        $rootScope.email = sessionData.email;
    };

    var switchToSignedin = function(){
        setSessionDataToRootScope();
        $rootScope.signedin = true;
        $location.path('/');
    };

    var setRootScopeDataToSignout = function(){
        $rootScope.signedin = false;
        $rootScope.userName = null;
        $rootScope.email = null;
    };

    var switchToSignedoutAndShowSigninPage = function(){
        setRootScopeDataToSignout();
        $location.path('/signin');
    };

    $rootScope.$on('event:authentication:signin:succeeded', function(){
        switchToSignedin();
    });

    $rootScope.$on('event:authentication:signin:failed', function(){
        switchToSignedoutAndShowSigninPage();
    });

    $rootScope.$on('event:authentication:signout:succeeded', function(){
        setRootScopeDataToSignout();
        $location.path('/');
    });

    $rootScope.$on('event:unauthorized', function(){
        switchToSignedoutAndShowSigninPage();
    });

    $rootScope.signedin = Authentication.getSigninStatus();
    if($rootScope.signedin)
    {
        setSessionDataToRootScope();
    }

}];
