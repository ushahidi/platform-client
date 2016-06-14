module.exports = AddPostButtonDirective;

AddPostButtonDirective.$inject = [];
function AddPostButtonDirective() {
    return {
        restrict: 'E',
        scope: true,
        controller: AddPostButtonController,
        templateUrl: 'templates/posts/views/add-post-text-button.html'
    };
}

AddPostButtonController.$inject = [
    '$scope',
    '$rootScope',
    'FormEndpoint',
    'SliderService',
    '$location'
];
function AddPostButtonController(
    $scope,
    $rootScope,
    FormEndpoint,
    SliderService,
    $location
) {
    $scope.forms = [];
    $scope.buttonToggle = false;
    $scope.buttonOptionsStyle = { opacity: 0, display: 'none' };
    $scope.toggleButton = toggleButton;
    $scope.createPost = createPost;
    $scope.disabled = false;

    activate();

    function activate() {
        // Load forms
        $scope.forms = FormEndpoint.query();
    }

    function createPost(path) {
        SliderService.close();
        $location.path('/posts/create/' + path);
    }

    function toggleButton() {
        if ($scope.forms.length === 1) {
            createPost($scope.forms[0].id);
        } else {
            $scope.buttonToggle = !$scope.buttonToggle;
            if ($scope.buttonToggle) {
                $scope.buttonOptionsStyle = { opacity: 1, display: 'flex' };
            } else {
                $scope.buttonOptionsStyle = { opacity: 0, display: 'none' };
            }
        }
    }
}
