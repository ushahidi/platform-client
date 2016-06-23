module.exports = PrivateController;

PrivateController.$inject = ['$scope', '$rootScope','$location'];
function PrivateController($scope, $rootScope, $location) {
    $rootScope.loggedin ? $location.url('/') : '';
}
