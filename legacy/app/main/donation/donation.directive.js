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
    'ConfigEndpoint',
    'DonationService',
    'Features'
];
function DonationController(
    $scope,
    $rootScope,
    ConfigEndpoint,
    DonationService,
    Features
) {
    $scope.loading = true;
    $scope.donationClientEnabled = $rootScope.donationClientEnabled || false;
    $scope.donationDeploymentEnabled = false;
    $scope.donationFeatureEnabled = false;

    $rootScope.$on('event:donation:started', function (event) {
        $rootScope.donationClientEnabled = true;
        $scope.donationClientEnabled = true;
    });

    $rootScope.$on('event:donation:settings:update', function (event, value) {
        $rootScope.donation = value;
    });

    Features.loadFeatures().then(function () {
        ConfigEndpoint.get({ id: 'site' }).$promise.then(function (site) {
            $rootScope.donation = site.donation;
            $scope.donationDeploymentEnabled = site.donation.enabled;
            $scope.donationFeatureEnabled = Features.isFeatureEnabled(
                'donation'
            );

            console.log($scope.donationClientEnabled);
            console.log($scope.donationFeatureEnabled);
            console.log($scope.donationDeploymentEnabled);

            if (
                $scope.donationFeatureEnabled &&
                $scope.donationDeploymentEnabled
            ) {
                $rootScope.$emit(
                    'setPaymentPointer',
                    $rootScope.donation.wallet
                );

                DonationService.setupMonetization();
            }

            $scope.loading = false;
        });
    });
}
