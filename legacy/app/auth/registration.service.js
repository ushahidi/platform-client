module.exports = [
    '$rootScope',
    '$http',
    '$q',
    'Util',
    '$location',
    'ModalService',
function (
    $rootScope,
    $http,
    $q,
    Util,
    $location,
    ModalService
) {

    return {

        register: function (realname, email, password) {
            var payload = {
                realname: realname,
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
        },

        openRegister: function () {
            ModalService.openTemplate('<register></register>', 'nav.register', false, false, true, false);
        }
    };

}];
