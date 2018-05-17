module.exports = HdxDetails;

HdxDetails.$inject = [];
function HdxDetails() {
    return {
        restrict: 'E',
        scope: {
        },
        controller: HdxDetailsController,
        template: require('./hdx-details.html')
    };
}

HdxDetailsController.$inject = [
    '$scope'
];
function HdxDetailsController($scope) {

}
