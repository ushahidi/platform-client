module.exports = [
    '$rootScope',
    '$location',
    'Authentication',
    'Session',
function (
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
        $rootScope.loggedin = true;
        if (redirect) {
            $location.url(redirect);
        }
    }

    function doLogout(redirect) {
        $rootScope.currentUser = null;
        $rootScope.loggedin = false;
        if (redirect) {
            $location.url(redirect);
        }
    }

    $rootScope.isAdmin = function () {
        return (($rootScope.currentUser || {}).role === 'admin');
    };

    $rootScope.goBack = function () {
        var path = $location.path().split('/');
        if (!path.length) {
            return;
        }
        path.pop();
        $location.path(path.join('/'));
    };

    $rootScope.switchRtl = function () {
        $rootScope.rtlEnabled = !$rootScope.rtlEnabled;
    };

    $rootScope.$on('event:authentication:login:succeeded', function () {
        doLogin(Session.getSessionDataEntry('loginPath') || '/');
    });

    $rootScope.$on('event:authentication:logout:succeeded', function () {
        doLogout('/');
    });

    $rootScope.$on('event:authentication:login:failed', function () {
        doLogout('/login');
    });

    $rootScope.$on('event:unauthorized', function () {
        if ($location.url() !== '/login') {
            Session.setSessionDataEntry('loginPath', $location.url());
        }
        Authentication.logout(true);
        doLogout('/login');
    });

    $rootScope.$on('event:forbidden', function () {
        if (Authentication.getLoginStatus()) {
            // We're logged in hit forbidden page
            $location.url('/forbidden');
        } else {
            // We're logged out, redirect to login
            if ($location.url() !== '/login') {
                Session.setSessionDataEntry('loginPath', $location.url());
            }
            $location.url('/login');
        }
    });

    if (Authentication.getLoginStatus()) {
        doLogin();
    }
}];
