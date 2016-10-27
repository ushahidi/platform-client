module.exports = FilterBySurveryDirective;

FilterBySurveryDirective.$inject = [];
function FilterBySurveryDirective() {
    return {
        restrict: 'E',
        scope: {
            filters: '='
        },
        replace: true,
        controller: FilterBySurveryController,
        templateUrl: 'templates/main/posts/views/filter-by-survey.html'
    };
}

FilterBySurveryController.$inject = ['$scope', '$rootScope'];
function FilterBySurveryController($scope, $rootScope) {

    $scope.openFilters = openFilters;

    activate();

    function activate() {
    }

    function openFilters() {
        $rootScope.$emit('filters:open:dropdown');
    }
}
