module.exports = DonationModalDirective;

DonationModalDirective.$inject = [];
function DonationModalDirective() {
    return {
        restrict: 'E',
        scope: {
            surveyId: '=',
            postId: '=',
            filters: '='
        },
        replace: true,
        controller: DonationModalController,
        template: require('./donation-modal.html')
    };
}

DonationModalController.$inject = [
    '$scope',
    '$rootScope',
    'Util',
    '$window'
];
function DonationModalController(
    $scope,
    $rootScope,
    Util,
    $window
) {
}
