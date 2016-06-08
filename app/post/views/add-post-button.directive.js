module.exports = AddPostButtonDirective;

AddPostButtonDirective.$inject = [];
function AddPostButtonDirective() {
    return {
        restrict: 'E',
        scope: true,
        replace: true,
        controller: AddPostButtonController,
        templateUrl: 'templates/posts/views/add-post-button.html'
    };
}

AddPostButtonController.$inject = [
    '$scope',
    '$location',
    'FormEndpoint',
    '_'
];
function AddPostButtonController(
    $scope,
    $location,
	FormEndpoint,
	_
) {
    $scope.forms = [];
    $scope.fabToggle = false;
    $scope.fabOptionsStyle = { opacity: 0, display: 'none' };
    $scope.toggleFab = toggleFab;

    activate();

    function activate() {
        // Load forms
        $scope.forms = FormEndpoint.query();
        
    }

    function toggleFab() {
        if (_.size($scope.forms) == 1) {
			$location.path('/posts/create/' + _.first($scope.forms).id);
        } else {
            $scope.fabToggle = !$scope.fabToggle;
            if ($scope.fabToggle) {
                $scope.fabOptionsStyle = { opacity: 1, display: 'flex' };
            } else {
                $scope.fabOptionsStyle = { opacity: 0, display: 'none' };
            }
        }
    }
}
