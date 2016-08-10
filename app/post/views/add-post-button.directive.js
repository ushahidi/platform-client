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
                    // if all_roles == FALSE, check to see if the user has access to post to this form
                    if (!form.all_roles) {
                        // Remove the form from the list if the user is not logged in
                        if ($rootScope.currentUser === null) {
                            delete forms[index];
                            if (index === forms.length -1) {
                                allowed_forms.resolve(_.compact(forms));
                            }
                        }
                        else {
                            // look up role by role name to get the role id
                            RoleEndpoint.query({ name: $rootScope.currentUser.role })
                            .$promise
                            .then(function(role) {
                                if (role.length === 1 && role[0].id) {
                                    FormRoleEndpoint.query({ formId: form.id })
                                    .$promise
                                    .then(function(roles) {
                                        var roles_allowed = _.pluck(roles, 'role_id');
                                        if (!_.contains(roles_allowed, role[0].id)) {
                                            delete forms[index];
                                        }
                                        if (index === forms.length -1) {
                                            allowed_forms.resolve(_.compact(forms));
                                        }
                                    });
                                } else {
                                    delete forms[index];
                                    if (index === forms.length -1) {
                                        allowed_forms.resolve(_.compact(forms));
                                    }
                                }
                            });
                        }
                    }
                });
            }
            else {
                allowed_forms.resolve(forms);
            }
        });
        
        return allowed_forms.promise;   
    }
}
