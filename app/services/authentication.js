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

    // check if initially we have an old access_token and assume that,
    // if yes, we are still signedin
    var signinStatus = !!Session.getSessionDataEntry('accessToken'),

    setToSigninState = function(userData){
        Session.setSessionDataEntries(
            {
                'userId': userData.id,
                'userName': userData.username,
                'realName': userData.realname,
                'email': userData.email
            }
        );

        signinStatus = true;
    },

    setToSignoutState = function(){
        Session.clearSessionData();
        signinStatus = false;
    };

    return {

        signin: function(username, password)
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
            };


            var deferred = $q.defer();
            var handleRequestError = function(){
                deferred.reject();
                setToSignoutState();
                $rootScope.$broadcast('event:authentication:signin:failed');
            };

            $http.post(Util.url('/oauth/token'), payload).then(
                function(authResponse){
                    var accessToken = authResponse.data.access_token;
                    Session.setSessionDataEntry('accessToken', accessToken);

                    $http.get(Util.apiUrl('/users/me')).then(
                        function(userDataResponse){

                            setToSigninState(userDataResponse.data);

                            $rootScope.$broadcast('event:authentication:signin:succeeded');
                            deferred.resolve();

                        }, handleRequestError);
                }, handleRequestError);

            return deferred.promise;
        },

        signout: function(){
            //TODO: ASK THE BACKEND TO DESTROY SESSION

            setToSignoutState();
            $rootScope.$broadcast('event:authentication:signout:succeeded');
        },

        getSigninStatus: function(){
            return signinStatus;
        }
    };

}];
