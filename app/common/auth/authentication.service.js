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

    // check whether we have initially an old access_token and userId
    // and assume that, if yes, we are still loggedin
    var loginStatus = !!Session.getSessionDataEntry('accessToken') && !!Session.getSessionDataEntry('userId'),

    setToLoginState = function (userData) {
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
    },

    setToLogoutState = function () {
        Session.clearSessionData();
        UserEndpoint.invalidateCache();
        loginStatus = false;
    };

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

            deferred = $q.defer(),

            handleRequestError = function () {
                deferred.reject();
                setToLogoutState();
                $rootScope.$broadcast('event:authentication:login:failed');
            },

            handleRequestSuccess = function (authResponse) {
                var accessToken = authResponse.data.access_token;
                Session.setSessionDataEntry('accessToken', accessToken);

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
                            setToLoginState(userDataResponse.data);
                            $rootScope.$broadcast('event:authentication:login:succeeded');
                            deferred.resolve();
                        });
                    }, handleRequestError);
            };

            $http.post(Util.url('/oauth/token'), payload).then(handleRequestSuccess, handleRequestError);

            return deferred.promise;
        },

        logout: function (silent) {
            //TODO: ASK THE BACKEND TO DESTROY SESSION

            // Release all locks owned by the user
            // TODO: At present releasing locks should not prevent users from logging out
            // in future this should be expanded to include an error state
            // Though ultinately unlocking should be handled solely API side
            PostLockEndpoint.unlock().$promise.finally(function () {
                setToLogoutState();
                if (!silent) {
                    $rootScope.$broadcast('event:authentication:logout:succeeded');
                }
            });
        },

        getLoginStatus: function () {
            return loginStatus;
        },

        openLogin: function () {

            ModalService.openTemplate('<login></login>', 'nav.login', false, false, false, false);
        }
    };

}];
