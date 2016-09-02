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
    '$q',
    '$scope',
    '$rootScope',
    'FormEndpoint',
    'RoleEndpoint',
    'FormRoleEndpoint',
    '$location',
    '_'
];
function AddPostButtonController(
    $q,
    $scope,
    $rootScope,
    FormEndpoint,
    RoleEndpoint,
    FormRoleEndpoint,
    $location,
    _
) {
    $scope.forms = [];
    $scope.fabToggle = false;
    $scope.fabOptionsStyle = { opacity: 0, display: 'none' };
    $scope.toggleFab = toggleFab;
    $scope.disabled = true;

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

        $rootScope.$on('post:list:selected', handlePostSelected);
    }

    function toggleFab() {
        if ($scope.forms.length === 1) {
            $location.path('/posts/create/' + $scope.forms[0].id);
        } else {
            $scope.fabToggle = !$scope.fabToggle;
            if ($scope.fabToggle) {
                $scope.fabOptionsStyle = { opacity: 1, display: 'flex' };
            } else {
                $scope.fabOptionsStyle = { opacity: 0, display: 'none' };
            }
        }
    }

    function handlePostSelected(event, selectedPosts) {
        $scope.disabled = selectedPosts.length > 0;
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
