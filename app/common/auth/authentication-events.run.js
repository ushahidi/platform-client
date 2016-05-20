module.exports = [
    '$rootScope',
    '$location',
    'Authentication',
    'Session',
    '_',
function (
    $rootScope,
    $location,
    Authentication,
    Session,
    _
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

    // todo: move to service
    $rootScope.hasManagePermission = function () {
        return $rootScope.isAdmin() ? true : ((($rootScope.currentUser || {}).permissions || {}).length > 0);
    };

    // todo: move to service
    $rootScope.hasManageSettingsPermission = function () {
        return $rootScope.isAdmin() ? true : (_.intersection(($rootScope.currentUser || {}).permissions, ['Manage Users', 'Manage Settings', 'Bulk Data Import']).length > 0);
    };

    // todo: move to service
    $rootScope.hasPermission = function (permission) {
        return $rootScope.isAdmin() ? true : _.contains(($rootScope.currentUser || {}).permissions, permission);
    };

    // todo: move to service
    $rootScope.isAdmin = function () {
        return (($rootScope.currentUser || {}).role === 'admin');
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
