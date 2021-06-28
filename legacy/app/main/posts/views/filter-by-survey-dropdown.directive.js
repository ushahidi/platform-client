module.exports = FilterBySurveryDropdownDirective;

FilterBySurveryDropdownDirective.$inject = [];
function FilterBySurveryDropdownDirective() {
    return {
        restrict: 'A',
        replace: true,
        controller: FilterBySurveryDropdownController
    };
}

FilterBySurveryDropdownController.$inject = ['$scope', '$rootScope'];
function FilterBySurveryDropdownController($scope, $rootScope) {

    $scope.filtersMenuOpen = false;

    activate();

    function activate() {
        $rootScope.$on('filters:open:dropdown', function () {
            externalOpenDropDown();
        });
    }

    function externalOpenDropDown() {
        $scope.filtersMenuOpen = true;
    }
}
