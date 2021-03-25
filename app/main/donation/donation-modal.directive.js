module.exports = DonationModalDirective;

DonationModalDirective.$inject = [];
function DonationModalDirective() {
    return {
        restrict: 'E',
        scope: {
            'donation': '='
        },
        replace: true,
        controller: DonationModalController,
        template: require('./donation-modal.html')
    };
}

DonationModalController.$inject = [
    '$scope',
    '$rootScope'
];
function DonationModalController(
    $scope,
    $rootScope
) {
    $scope.donationClientEnabled = $rootScope.donationClientEnabled;
}
