module.exports = PasswordResetConfirmController;

PasswordResetConfirmController.$inject = ['$rootScope', 'PasswordReset', '$location', '$routeParams'];
function PasswordResetConfirmController($rootScope, PasswordReset, $location, $routeParams) {
    var $scope = $rootScope.$new();
    $scope.token = $routeParams.token;

    PasswordReset.openResetConfirm($scope);
    $location.url('/');
}
