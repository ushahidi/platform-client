module.exports = DonationToolbarDirective;

DonationToolbarDirective.$inject = [];
function DonationToolbarDirective() {
    return {
        restrict: 'E',
        scope: {},
        replace: true,
        controller: DonationToolbarController,
        template: require('./donation-toolbar.html')
    };
}

DonationToolbarController.$inject = ['$scope', '$rootScope', 'DonationService'];
function DonationToolbarController($scope, $rootScope, DonationService) {
    $scope.formattedAmount = 0.0;
    $scope.openDonationModal = DonationService.openDonationModal;

    $rootScope.$on('setDonatedAmount', function (event, value) {
        $scope.formattedAmount = value;
        $scope.$apply();
    });
}
