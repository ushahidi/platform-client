module.exports = [
    '$rootScope',
    'PasswordReset',
    '$location',
    '$routeParams',
function (
    $rootScope,
    PasswordReset,
    $location,
    $routeParams
) {
    var $scope = $rootScope.$new();
    $scope.token = $routeParams.token;

    PasswordReset.openResetConfirm($scope);
    $location.url('/');
}];
