module.exports = PasswordResetConfirmController;

PasswordResetConfirmController.$inject = ['$rootScope', 'PasswordReset', '$location', '$transition$'];
function PasswordResetConfirmController($rootScope, PasswordReset, $location, $transition$) {
    var $scope = $rootScope.$new();
    $scope.token = decodeURIComponent($transition$.params().token);

    PasswordReset.openResetConfirm($scope);
    $location.url('/');
}
