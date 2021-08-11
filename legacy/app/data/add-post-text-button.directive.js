module.exports = AddPostButtonDirective;

AddPostButtonDirective.$inject = [];
function AddPostButtonDirective() {
    return {
        restrict: 'E',
        scope: true,
        controller: AddPostButtonController,
        template: require('./add-post-text-button.html')
    };
}

AddPostButtonController.$inject = [
    '$scope',
    'PostSurveyService',
    'SliderService',
    '$location'
];
function AddPostButtonController(
    $scope,
    PostSurveyService,
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
        PostSurveyService.allowedSurveys()
            .then(function (forms) {
                $scope.forms = forms;
                if (forms.length > 0) {
                    $scope.disabled = false;
                }
            });
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
