module.exports = [
    '$rootScope',
    '$location',
    'Authentication',
    'Session',
function(
    $rootScope,
    $location,
    Authentication,
    Session
) {
    function loadSessionData() {
        $rootScope.currentUser = Session.getSessionData();
    }

    function doLogin(redirect) {
        loadSessionData();
        $rootScope.signedin = true;
        if (redirect) {
            $location.path(redirect);
        }
    }

    function doLogout(redirect) {
        $rootScope.currentUser = null;
        $rootScope.signedin = false;
        if (redirect) {
            $location.path(redirect);
        }
    }

    $rootScope.isAdmin = function() {
        return (($rootScope.currentUser || {}).role === 'admin');
    };

    $rootScope.goBack = function() {
        var path = $location.path().split('/');
        if (!path.length) {
            return;
        }
        path.pop();
        $location.path(path.join('/'));
    };

    $rootScope.$on('event:authentication:login:succeeded', function(){
        doLogin('/');
    });

    $rootScope.$on('event:authentication:logout:succeeded', function(){
        doLogout('/');
    });

    $rootScope.$on('event:authentication:login:failed', function(){
        doLogout('/login');
    });

    $rootScope.$on('event:unauthorized', function(){
        doLogout('/login');
    });

    if (Authentication.getLoginStatus()) {
        loadSessionData();
    }
}];
