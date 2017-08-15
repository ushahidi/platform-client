module.exports = DateSelectDirective;

DateSelectDirective.$inject = [];
function DateSelectDirective() {
    return {
        restrict: 'E',
        scope: {
            dateBeforeModel: '=',
            dateAfterModel: '='
        },
        controller: DateSelectController,
        template: require('./filter-date.html')
    };
}

DateSelectController.$inject = ['$scope'];
function DateSelectController($scope) {
    $scope.options = { format : 'yyyy-mm-dd' };
}
