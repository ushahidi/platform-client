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

DonationToolbarController.$inject = [
    '$scope',
    'Util',
    '$window'
];
function DonationToolbarController(
    $scope,
    Util,
    $window
) {
}
