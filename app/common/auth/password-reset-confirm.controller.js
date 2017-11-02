module.exports = PasswordResetConfirmController;

PasswordResetConfirmController.$inject = ['$rootScope', 'PasswordReset', '$location', '$stateParams'];
function PasswordResetConfirmController($rootScope, PasswordReset, $location, $stateParams) {
    var $scope = $rootScope.$new();
    $scope.token = $stateParams.token;

    PasswordReset.openResetConfirm($scope);
    $location.url('/');
}
