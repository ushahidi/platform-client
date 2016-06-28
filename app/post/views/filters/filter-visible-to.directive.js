module.exports = VisibleToSelectDirective;

VisibleToSelectDirective.$inject = [];
function VisibleToSelectDirective() {
    return {
        restrict: 'E',
        scope: {
            statusModel: '=',
            publishedToModel: '='
        },
        controller: VisibleToSelectController,
        templateUrl: 'templates/posts/views/filters/filter-visible-to.html'
    };
}

VisibleToSelectController.$inject = ['$scope', 'RoleEndpoint', '$rootScope'];
function VisibleToSelectController($scope, RoleEndpoint, $rootScope) {
    $scope.roles = [];
    $scope.visible_to = '';
    $scope.hasPermission = $rootScope.hasPermission;

    activate();

    $scope.$watch('statusModel', updateStateFromModels);
    $scope.$watch('publishedToModel', updateStateFromModels);
    $scope.$watch('visible_to', updateModelsFromState);

    function activate() {
        $scope.roles = RoleEndpoint.query();
    }

    function updateStateFromModels() {
        if ($scope.statusModel === 'draft') {
            $scope.visible_to = 'draft';
        } else if ($scope.statusModel === 'all') {
            $scope.visible_to = 'everyone';
        } else if ($scope.statusModel === 'published' && !$scope.publishedToModel) {
            $scope.visible_to = 'everyone';
        } else {
            $scope.visible_to = $scope.publishedToModel;
        }
    }

    function updateModelsFromState() {
        if ($scope.visible_to === 'everyone') {
            $scope.statusModel = 'all';
            $scope.publishedToModel = '';
        } else if ($scope.visible_to === 'draft') {
            $scope.statusModel = 'draft';
            $scope.publishedToModel = '';
        } else {
            $scope.statusModel = 'published';
            $scope.publishedToModel = $scope.visible_to;
        }
    }
}
