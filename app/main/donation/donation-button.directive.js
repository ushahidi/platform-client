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
    'ModalService'
];
function DonationButtonController(
    $scope,
    $window,
    ModalService
) {
    $scope.loading = false;
    $scope.openDonationModal = openDonationModal;
    $scope.isButton = isButton;

    activate();

    function activate() {
    }

    function isButton() {
        return $scope.button;
    }

    function openDonationModal() {
        ModalService.openTemplate('<donation-modal> </donation-modal>', 'app.donate', false, $scope, true, true, true);
    }
}
