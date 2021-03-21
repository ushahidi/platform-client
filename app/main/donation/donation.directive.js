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
    '$window',
    'ConfigEndpoint'
];
function DonationController(
    $scope,
    $window,
    ConfigEndpoint
) {
    $scope.loading = false;

    activate();

    function activate() {
    }
}
