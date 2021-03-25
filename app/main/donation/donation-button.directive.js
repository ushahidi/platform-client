module.exports = DonationButtonDirective;

DonationButtonDirective.$inject = [];
function DonationButtonDirective() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            button: '=?'
        },
        controller: DonationButtonController,
        template: require('./donation-button.html')
    };
}

DonationButtonController.$inject = [
    '$scope',
    '$window',
    'DonationService'
];
function DonationButtonController(
    $scope,
    $window,
    DonationService
) {
    $scope.loading = false;
    $scope.openDonationModal = DonationService.openDonationModal;
    $scope.isButton = isButton;

    function isButton() {
        return $scope.button;
    }
}
