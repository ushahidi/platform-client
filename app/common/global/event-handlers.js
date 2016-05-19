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

    $rootScope.hasManagePermission = function () {
        return $rootScope.isAdmin() ? true : ((($rootScope.currentUser || {}).permissions || {}).length > 0);
    };

    $rootScope.hasManageSettingsPermission = function () {
        return $rootScope.isAdmin() ? true : (_.intersection(($rootScope.currentUser || {}).permissions, ['Manage Users', 'Manage Settings', 'Bulk Data Import']).length > 0);
    };

    $rootScope.hasPermission = function (permission) {
        return $rootScope.isAdmin() ? true : _.contains(($rootScope.currentUser || {}).permissions, permission);
    };

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

    // Setup PL layout and switching function
    $rootScope.globalLayout = 'layout-a';
    $rootScope.setLayout = function (layout) {
        $rootScope.globalLayout = layout;
    };

    // Setup PL modal visible and switching function
    $rootScope.modalVisible = false;
    $rootScope.toggleModalVisible = function () {
        $rootScope.modalVisible = !$rootScope.modalVisible;
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
