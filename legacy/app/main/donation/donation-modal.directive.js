const { config } = require("raven-js");

module.exports = DonationModalDirective;

DonationModalDirective.$inject = [];
function DonationModalDirective() {
    return {
        restrict: "E",
        scope: {},
        replace: true,
        controller: DonationModalController,
        template: require("./donation-modal.html"),
    };
}

DonationModalController.$inject = ["$scope", "$rootScope"];
function DonationModalController($scope, $rootScope) {
    $scope.donation = $rootScope.donation;
    $scope.donationClientEnabled = $rootScope.donationClientEnabled;
}
