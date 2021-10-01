module.exports = GmailAuthDirective;

GmailAuthDirective.$inject = [];
function GmailAuthDirective() {
    return {
        restrict: 'E',
        scope: true,
        controller: GmailAuthController,
        template: require('./gmail-auth.html')
    };
}
GmailAuthController.$inject = [
    '$scope'
];
function GmailAuthController(
    $scope
) {
    $scope.processing = false;
    $scope.code = '';

    $scope.submit = submit;
    $scope.cancel = cancel;

    $scope.processing = false;

    function submit() {
        $scope.processing = true;
        $scope.$parent.authorizeGmailProvider($scope.code, $scope.date)
        .finally(function () {
            $scope.processing = false;
            $scope.$parent.closeModal();
        })
    }

    function cancel() {
        $scope.$parent.closeModal();
    }
}
