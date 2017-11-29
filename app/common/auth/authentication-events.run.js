module.exports = AuthenticationEvents;
AuthenticationEvents.$inject = ['$rootScope', '$location', 'Authentication', 'Session', '_', '$state', 'TermsOfService', 'Notify', 'PostFilters'];
function AuthenticationEvents($rootScope, $location, Authentication, Session, _, $state, TermsOfService, Notify, PostFilters) {
    let loginPath = null;
    $rootScope.currentUser = null;
    $rootScope.loggedin = false;

    activate();

    function activate() {
        if (Authentication.getLoginStatus()) {
            doLogin(false, true);
        } else {
            doLogout(false);
        }
    }

    function loadSessionData() {
        $rootScope.currentUser = Session.getSessionData();
    }

    function doLogin(redirect, noReload) {
        TermsOfService.getTosEntry()
            .then(function () {
                loadSessionData();
                $rootScope.loggedin = true;
                /**
                 * adminUserSetup is called AFRTER the user has agreed to terms of service.
                 * adminUserSetup is used to verify which user is logging in/logged in and opening a modal box
                 * when there is an admin login with the 'admin' email instead of a proper email.
                 * This is part of an effort to force admins to have proper emails and not use the default email/password combination that the
                 * system had during the setup process.
                 * references https://github.com/ushahidi/platform/issues/1714
                 */
                adminUserSetup();
                PostFilters.resetDefaults();
                if (redirect) {
                    $location.url(redirect);
                }
                noReload || $state.reload(); // in favor of $route.reload();

            });
    }

    function doLogout(redirect) {
        $rootScope.currentUser = null;
        $rootScope.loggedin = false;
        // we don' wat to reload until after filters are correctly set with the backend default that the user
        // would get when logged out
        PostFilters.resetDefaults().then(function () {
            if (redirect) {
                $location.url(redirect);
            }

            $state.go($state.$current.name ? $state.$current : 'map', null, { reload: true });
        });
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
        doLogin(loginPath);
    });

    $rootScope.$on('event:authentication:logout:succeeded', function () {
        doLogout();
    });

    // Don't think this is needed. We should already be logged out before this event
    // $rootScope.$on('event:authentication:login:failed', function () {
    //     doLogout();
    // });

    $rootScope.$on('event:unauthorized', function () {
        let currentUrl = $location.url();
        if (currentUrl !== '/login') {
            loginPath = currentUrl;
        }
        Authentication.logout(true);
        doLogout();
        Authentication.openLogin();
    });

    $rootScope.$on('event:forbidden', function () {
        if (Authentication.getLoginStatus()) {
            // We're logged in hit forbidden page
            $location.url('/forbidden');
        } else {
            let currentUrl = $location.url();
            // We're logged out, redirect to login
            if (currentUrl !== '/login') {
                loginPath = currentUrl;
                // Show forbidden page until we're logged in
                $location.url('/forbidden');
            }
            Authentication.openLogin();
        }
    });

    function adminUserSetup() {
        if ($rootScope.currentUser.email === 'admin' && $rootScope.isAdmin()) {
            Notify.adminUserSetupModal();
        }

    }

}
