module.exports = DonationDirective;

DonationDirective.$inject = [];
function DonationDirective() {
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        controller: DonationController,
        template: require('./donation.html')
    };
}

DonationController.$inject = [
    '$scope',
    '$rootScope',
    'DonationService',
    'Features'
];
function DonationController(
    $scope,
    $rootScope,
    DonationService,
    Features
) {
    $scope.loading = true;
    $scope.donationClientEnabled = $rootScope.donationClientEnabled || false;
    $scope.donationDeploymentEnabled = false;
    $scope.donationFeatureEnabled = false;

    $rootScope.$on('event:donation:started', function () {
        $rootScope.donationClientEnabled =  true;
        $scope.donationClientEnabled = true;
    });

    Features.loadFeatures().then(function () {
        $scope.donationFeatureEnabled = Features.isFeatureEnabled('donation');

        $scope.donationDeploymentEnabled = $rootScope.donation.enabled;

        if ($scope.donationFeatureEnabled && $scope.donationDeploymentEnabled) {
            DonationService.setupMonetization();

            $rootScope.$emit('setPaymentPointer', $rootScope.donation.wallet);
        }

        $scope.loading = false;
    });
}
