
module.exports = FilterUnmappedDirective;

FilterUnmappedDirective.$inject = [];

function FilterUnmappedDirective() {
    return {
        restrict: 'E',
        scope: {
            unmapped: '='
        },
        controller: FilterUnmappedController,
        template: require('./filter-unmapped.html')
    };
}
FilterUnmappedController.$inject = ['$scope', '$translate'];

function FilterUnmappedController($scope, $translate) {

}
