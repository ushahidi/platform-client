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
    'FormEndpoint'
];
function AddPostButtonController(
    $scope,
	FormEndpoint
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
        $scope.fabToggle = !$scope.fabToggle;
        if ($scope.fabToggle) {
            $scope.fabOptionsStyle = { opacity: 1, display: 'flex' };
        } else {
            $scope.fabOptionsStyle = { opacity: 0, display: 'none' };
        }
    }
}
