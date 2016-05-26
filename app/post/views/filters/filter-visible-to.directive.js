module.exports = VisibleToSelectDirective;

VisibleToSelectDirective.$inject = [];
function VisibleToSelectDirective() {
    return {
        restrict: 'E',
        scope: {
            model: '='
        },
        controller: VisibleToSelectController,
        templateUrl: 'templates/posts/views/filters/filter-visible-to.html'
    };
}

VisibleToSelectController.$inject = ['$scope', 'RoleEndpoint'];
function VisibleToSelectController($scope, RoleEndpoint) {
    $scope.roles = [];
    activate();

    function activate() {
        $scope.roles = RoleEndpoint.query();
    }
}
