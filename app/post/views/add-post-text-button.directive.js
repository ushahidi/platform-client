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
    '$location',
    '$q'
];
function AddPostButtonController(
    $scope,
    $rootScope,
    FormEndpoint,
    SliderService,
    $location,
    $q
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
        allowedForms()
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

    function allowedForms() {
        var allowed_forms = $q.defer();

        FormEndpoint.query()
        .$promise
        .then(function (forms) {
            if ($rootScope.hasPermission('Manage Posts')) {
                allowed_forms.resolve(forms);
            } else {
                allowed_forms.resolve(_.filter(forms, function (form) {
                    // if everyone_can_create, include the form
                    if (form.everyone_can_create) {
                        return true;
                    }
                    // Otherwise, continue to check if the user has access

                    // If we're not logged in, we have no role so we definitely don't have access
                    if ($rootScope.currentUser === null) {
                        return false;
                    }

                    // Finally, if we are logged in, check if our role is in the list
                    if (_.contains(form.can_create, $rootScope.currentUser.role)) {
                        return true;
                    }

                    return false;
                }));
            }
        });

        return allowed_forms.promise;
    }
}
