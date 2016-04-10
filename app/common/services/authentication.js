module.exports = [
    '$rootScope',
    '$http',
    '$q',
    'Util',
    'CONST',
    'Session',
    'RoleEndpoint',
    '_',
function (
    $rootScope,
    $http,
    $q,
    Util,
    CONST,
    Session,
    RoleEndpoint,
    _
) {

    // check whether we have initially an old access_token and userId
    // and assume that, if yes, we are still loggedin
    var loginStatus = !!Session.getSessionDataEntry('accessToken') && !!Session.getSessionDataEntry('userId'),


    setToLoginState = function (userData) {
        Session.setSessionDataEntries({
            userId: userData.id,
            realname: userData.realname,
            email: userData.email,
            role: userData.role,
            permissions: userData.permissions
        });

        loginStatus = true;
    },

    setToLogoutState = function () {
        Session.clearSessionData();
        loginStatus = false;
    };

    return {

        login: function (username, password, google2fa_otp) {
            var payload = {
                username: username,
                password: password,
                grant_type: 'password',
                client_id: CONST.OAUTH_CLIENT_ID,
                client_secret: CONST.OAUTH_CLIENT_SECRET,
                scope: CONST.CLAIMED_USER_SCOPES.join(' ')
            },

            deferred = $q.defer(),

            handleRequestError = function (rejection) {
                deferred.reject(rejection);
                setToLogoutState();
                $rootScope.$broadcast('event:authentication:login:failed');
            },

            handleRequestSuccess = function (authResponse) {
                var accessToken = authResponse.data.access_token;
                Session.setSessionDataEntry('accessToken', accessToken);

                $http.get(Util.apiUrl('/users/me')).then(
                    function (userDataResponse) {
                        RoleEndpoint.query({name: userDataResponse.data.role}).$promise.then(function (results) {
                            userDataResponse.data.permissions = !_.isEmpty(results) ? results[0].permissions : [];
                            setToLoginState(userDataResponse.data);

                            $rootScope.$broadcast('event:authentication:login:succeeded');

                            deferred.resolve();
                        });
                    }, handleRequestError);
            };

            // If set append google2fa_otp
            if (google2fa_otp) {
                payload.google2fa_otp = google2fa_otp;
            }
            $http.post(Util.url('/oauth/token'), payload).then(handleRequestSuccess, handleRequestError);

            return deferred.promise;
        },

        logout: function (silent) {
            //TODO: ASK THE BACKEND TO DESTROY SESSION

            setToLogoutState();
            if (!silent) {
                $rootScope.$broadcast('event:authentication:logout:succeeded');
            }
        },

        getLoginStatus: function () {
            return loginStatus;
        }
    };

}];
