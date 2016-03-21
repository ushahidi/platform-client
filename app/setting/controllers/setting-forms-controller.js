module.exports = [
    '$scope',
    '$translate',
    '$location',
    '$q',
    'FormEndpoint',
    'FormStageEndpoint',
    'Notify',
    'Config',
    '_',
function (
    $scope,
    $translate,
    $location,
    $q,
    FormEndpoint,
    FormStageEndpoint,
    Notify,
    Config,
    _
) {
    $scope.formQuota = (typeof Config.features.limits !== 'undefined') ? Config.features.limits.forms : true;

    $translate('nav.posts_and_entities').then(function (title) {
        $scope.title = title;
        $scope.$emit('setPageTitle', title);
    });

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
        $translate('notify.form.delete_form_confirm')
        .then(function (message) {
            Notify.showConfirm(message).then(function () {
                FormEndpoint.delete({
                    id: form.id
                }).$promise.then(function () {
                    $translate('notify.form.destroy_form_success', { name: form.name }).then(function (message) {
                        Notify.showNotificationSlider(message);
                    });
                    $scope.refreshForms();
                });
            });
        });
    };

    $scope.saveNewForm = function (form) {
        // Save the form and translate the Structure stage label
        $q.all({
            form: FormEndpoint.saveCache(form).$promise,
            label: $translate('form.structure_step')
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
                    $translate('notify.form.save_success', {name: form.name}).then(function (message) {
                        Notify.showNotificationSlider(message);
                    });
                    $location.url('/settings/forms/' + form.id);
                });
        }, function (errorResponse) {
            var validationErrors = [];
            // @todo refactor limit handling
            _.each(errorResponse.data.errors, function (value, key) {
                // Ultimately this should check individual status codes
                // for the moment just check for the message we expect
                if (value.title === 'limit::admin') {
                    $translate('limit.post_type_limit_reached').then(function (message) {
                        Notify.showLimitSlider(message);
                    });
                } else {
                    validationErrors.push(value);
                }
            });

            Notify.showApiErrors(validationErrors);
            $scope.processing = false;
        });
    };
    // End new form
}];
