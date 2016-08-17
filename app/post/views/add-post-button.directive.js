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
            .then(function(forms) {
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
        .then(function(forms) {
            if (!$rootScope.isAdmin()) {
                _.each(forms, function(form, index) {
                    // if everyone_can_create == FALSE, check to see if the user role has access
                    // to add a post to this form
                    if (!form.everyone_can_create) {
                        // Remove the form from the list if the user is not logged in
                        if ($rootScope.currentUser === null) {
                            delete forms[index];
                        }
                        else {
                            if (!_.contains(form.can_add, $rootScope.currentUser.role)) {
                                delete forms[index];
                            }
                        }
                    }
                });
                allowed_forms.resolve(_.compact(forms));
            }
            else {
                allowed_forms.resolve(forms);
            }
        });
        
        return allowed_forms.promise;   
    }
}
