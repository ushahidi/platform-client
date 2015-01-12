module.exports = [
    '$rootScope',
    '$http',
    '$q',
    'Util',
    'CONST',
    'Session',
function(
    $rootScope,
    $http,
    $q,
    Util,
    CONST,
    Session
) {

    // check whether we have initially an old access_token and assume that,
    // if yes, we are still signedin
    var loginStatus = !!Session.getSessionDataEntry('accessToken'),

    setToSigninState = function(userData){
        Session.setSessionDataEntries({
            userId: userData.id,
            userName: userData.username,
            realName: userData.realname,
            email: userData.email,
            role: userData.role
        });

        loginStatus = true;
    },

    setToLogoutState = function(){
        Session.clearSessionData();
        loginStatus = false;
    };

    return {

        login: function(username, password)
        {
            var claimedScopes = [
                'posts',
                'media',
                'forms',
                'api',
                'tags',
                'sets',
                'users',
                'stats',
                'layers',
                'config',
                'messages',
                'dataproviders'
            ],
            payload = {
                username: username,
                password: password,
                grant_type: 'password',
                client_id: CONST.OAUTH_CLIENT_ID,
                client_secret: CONST.OAUTH_CLIENT_SECRET,
                scope: claimedScopes.join(' ')
            },

            deferred = $q.defer(),

            handleRequestError = function(){
                deferred.reject();
                setToLogoutState();
                $rootScope.$broadcast('event:authentication:login:failed');
            },

            handleRequestSuccess = function(authResponse){
                var accessToken = authResponse.data.access_token;
                Session.setSessionDataEntry('accessToken', accessToken);

                $http.get(Util.apiUrl('/users/me')).then(
                    function(userDataResponse){

                        setToSigninState(userDataResponse.data);

                        $rootScope.$broadcast('event:authentication:login:succeeded');
                        deferred.resolve();

                    }, handleRequestError);
            };

            $http.post(Util.url('/oauth/token'), payload).then(handleRequestSuccess, handleRequestError);

            return deferred.promise;
        },

        logout: function(){
            //TODO: ASK THE BACKEND TO DESTROY SESSION

            setToLogoutState();
            $rootScope.$broadcast('event:authentication:logout:succeeded');
        },

        getSigninStatus: function(){
            return loginStatus;
        }
    };

}];
