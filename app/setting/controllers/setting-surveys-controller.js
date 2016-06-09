module.exports = [
    '$scope',
    '$rootScope',
    '$translate',
    '$location',
    '$q',
    'FormEndpoint',
    'FormStageEndpoint',
    'Notify',
    '_',
    'Features',
function (
    $scope,
    $rootScope,
    $translate,
    $location,
    $q,
    FormEndpoint,
    FormStageEndpoint,
    Notify,
    _,
    Features
) {

    // Change layout class
    $rootScope.setLayout('layout-b');
    // Redirect to home if not authorized
    if ($rootScope.hasManageSettingsPermission() === false) {
        return $location.path('/');
    }

    Features.loadFeatures().then(function () {
        $scope.formQuota = Features.getLimit('forms');
    });

    $translate('nav.posts_and_entities').then(function (title) {
        $scope.title = title;
        $scope.$emit('setPageTitle', title);
    });
    // Change mode
    $scope.$emit('event:mode:change', 'settings');

    // Get all the forms for display
    $scope.refreshForms = function () {
        FormEndpoint.query().$promise.then(function (response) {
            $scope.forms = response;
        });
    };
    $scope.refreshForms();

    // Manage new form settings
    $scope.isNewFormOpen = false;
    $scope.openNewForm = function () {
        $scope.newForm = {};
        $scope.isNewFormOpen = !$scope.isNewFormOpen;
    };

    $scope.deleteForm = function (form) {
        Notify.confirm('notify.form.delete_form_confirm').then(function () {
            FormEndpoint.delete({
                id: form.id
            }).$promise.then(function () {
                Notify.notify('notify.form.destroy_form_success', { name: form.name });
                $scope.refreshForms();
            });
        });
    };

    $scope.saveNewForm = function (form) {
        // Save the form and translate the Structure stage label
        $q.all({
            form: FormEndpoint.saveCache(form).$promise,
            label: $translate('form.post_step')
        }).then(function (data) {
            form = data.form;
            var label = data.label,
                // create Structure stage
                stage = {label: label, required: '0', formId: form.id};

            // Save the Structure stage and go to the editor
            FormStageEndpoint
                .saveCache(stage)
                .$promise
                .then(function (stage) {
                    $scope.isNewStageOpen = false;
                    $scope.newStage = {};
                    Notify.notify('notify.form.save_success', { name: form.name });
                    $location.url('/settings/forms/' + form.id);
                });
        }, function (errorResponse) {
            var validationErrors = [];
            // @todo refactor limit handling
            _.each(errorResponse.data.errors, function (value, key) {
                // Ultimately this should check individual status codes
                // for the moment just check for the message we expect
                if (value.title === 'limit::admin') {
                    Notify.limit('limit.post_type_limit_reached');
                } else {
                    validationErrors.push(value);
                }
            });

            Notify.apiErrors(validationErrors);
            $scope.processing = false;
        });
    };
    // End new form
}];
