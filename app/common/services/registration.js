module.exports = [
    '$rootScope',
    '$http',
    '$q',
    'Util',
    '$location',
function (
    $rootScope,
    $http,
    $q,
    Util,
    $location
) {

    return {

        register: function (email, username, password) {
            var payload = {
                username: username,
                email: email,
                password: password
            },

            deferred = $q.defer(),

            handleRequestError = function (response) {
                deferred.reject(response);
                $rootScope.$broadcast('event:registration:register:failed');
            },

            handleRequestSuccess = function (response) {
                $rootScope.$broadcast('event:registration:register:succeeded');
                deferred.resolve(response);
            };

            $http.post(Util.apiUrl('/register'), payload).then(handleRequestSuccess, handleRequestError);

            return deferred.promise;
        }
    };

}];
