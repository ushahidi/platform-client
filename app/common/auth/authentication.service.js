module.exports = [
    '$rootScope',
    '$http',
    '$q',
    'Util',
    'CONST',
    'Session',
    'RoleEndpoint',
    'UserEndpoint',
    'PostLockEndpoint',
    '_',
    'ModalService',
function (
    $rootScope,
    $http,
    $q,
    Util,
    CONST,
    Session,
    RoleEndpoint,
    UserEndpoint,
    PostLockEndpoint,
    _,
    ModalService
) {

    // check whether we have initially an valid access_token and assume that, if yes, we are still loggedin
    let loginStatus = false;
    if (!!Session.getSessionDataEntry('accessToken') &&
        Session.getSessionDataEntry('grantType') === 'password' &&      // TODO: tokenless requests cleanup
        !!Session.getSessionDataEntry('userId')
    ) {
        // If the access token is expired
        if (Session.getSessionDataEntry('accessTokenExpires') <= Math.floor(Date.now() / 1000)) {
            /*
             * TODO: if there's a refresh token in the session, we should attempt obtaining a new
             *       access token. BUT should we intercept and defer other requests until we obtain
             *       the token?
             */
            // Clear any login state
            setToLogoutState();
        } else {
            // Otherwise mark as logged in
            loginStatus = true;

            // Kick-off refresh schedule
            if (Session.getSessionDataEntry('refreshToken')) {
                scheduleRefreshAuth(Session.getSessionDataEntry('refreshToken'));
            }
        }
    }

    function setToLoginState(userData) {
        Session.setSessionDataEntries({
            userId: userData.id,
            realname: userData.realname,
            email: userData.email,
            role: userData.role,
            permissions: userData.permissions,
            gravatar: userData.gravatar,
            language: userData.language
        });
        loginStatus = true;
    }

    function continueLogout(silent) {
        setToLogoutState();
        if (!silent) {
            $rootScope.$broadcast('event:authentication:logout:succeeded');
        }
    }

    function setToLogoutState() {
        Session.clearSessionData();
        UserEndpoint.invalidateCache();
        loginStatus = false;
    }

    function handleRequestSuccess(authResponse) {
        var accessToken = authResponse.data.access_token;
        Session.setSessionDataEntry('accessToken', accessToken);
        if (authResponse.data.expires_in) {
            Session.setSessionDataEntry('accessTokenExpires', Math.floor(Date.now() / 1000) + authResponse.data.expires_in);
        } else if (authResponse.data.expires) {
            Session.setSessionDataEntry('accessTokenExpires', authResponse.data.expires);
        }
        // Setting a timer to refresh the session if a refresh-token is available
        if (authResponse.data.refresh_token) {
            Session.setSessionDataEntry('refreshToken', authResponse.data.refresh_token);
            scheduleRefreshAuth(authResponse.data.refresh_token);
        }
        Session.setSessionDataEntry('grantType', 'password'); // TODO: tokenless requests cleanup
    }

    function handleRequestError () {
        setToLogoutState();
        $rootScope.$broadcast('event:authentication:login:failed');
    };

    function scheduleRefreshAuth (refreshToken) {
        if (Session.getSessionDataEntry('accessTokenExpires')) {
            /* Getting a random number between 5 minutes and 11 minutes before the expiry time.
            (to avoid simultanous requests if the user has 2 or more tabs open)*/
            const minutesBefore = (Math.floor(Math.random() * 11) + 5) * 60;
            const timeToExpire = Session.getSessionDataEntry('accessTokenExpires') - Date.now() / 1000;
            const timeToRefresh = timeToExpire - minutesBefore;
            // Setting the timer to refresh token
            setTimeout(function () {
                //TODO: avoid sending the request if the token is no longer about to expire?
                // i.e. renewed in another tab
                let payload = {
                    refresh_token: refreshToken,
                    grant_type: 'refresh_token',
                    client_id: CONST.OAUTH_CLIENT_ID,
                    client_secret: CONST.OAUTH_CLIENT_SECRET,
                    scope: CONST.CLAIMED_USER_SCOPES.join(' ')
                };
                //TODO: If we want to show the login-box if the refresh-token is invalid, use error-handler
                //TODO: handle transient errors? would we still have time for retrying?
                $http.post(Util.url('/oauth/token'), payload).then(handleRequestSuccess, handleRequestError);
            }, timeToRefresh * 1000);
        }
    }

    return {

        login: function (username, password) {
            var payload = {
                username: username,
                password: password,
                grant_type: 'password',
                client_id: CONST.OAUTH_CLIENT_ID,
                client_secret: CONST.OAUTH_CLIENT_SECRET,
                scope: CONST.CLAIMED_USER_SCOPES.join(' ')
            },

            deferred = $q.defer();

            //Requesting tokens
            $http.post(Util.url('/oauth/token'), payload).then(authResponse => {
                //Setting required Sessions
                handleRequestSuccess(authResponse);
                // Fetching user-info
                $http.get(Util.apiUrl('/users/me')).then(
                    function (userDataResponse) {
                        RoleEndpoint.query({name: userDataResponse.data.role}).$promise
                        .then(function (results) {
                            userDataResponse.data.permissions = !_.isEmpty(results) ? results[0].permissions : [];
                            return userDataResponse;
                        })
                        .catch(function (errors) {
                            userDataResponse.data.permissions = [];
                            return userDataResponse;
                        })
                        .finally(function () {
                            /* Adjusting the UI to logged-in state
                            and runs the doLogin-function in Authentication-events */
                            setToLoginState(userDataResponse.data);
                            $rootScope.$broadcast('event:authentication:login:succeeded');
                            deferred.resolve();
                        });
                        // Handling 2 potential errors below, both the token-request and the user-info-request
                    }, () => {
                        deferred.reject();
                        handleRequestError();
                    });
                }, () => {
                    deferred.reject();
                    handleRequestError();
                });

            return deferred.promise;
        },

        logout: function (silent) {
            //TODO: ASK THE BACKEND TO DESTROY SESSION

            // Release all locks owned by the user
            // TODO: At present releasing locks should not prevent users from logging out
            // in future this should be expanded to include an error state
            // Though ultinately unlocking should be handled solely API side
            if ($rootScope.hasPermission('Manage Posts')) {
                PostLockEndpoint.unlock().$promise.finally(function () {
                    continueLogout(silent);
                });
            } else {
                continueLogout(silent);
            }
        },

        getLoginStatus: function () {
            return loginStatus;
        },

        openLogin: function () {

            ModalService.openTemplate('<login></login>', 'nav.login', false, false, false, false);
        }
    };

}];
