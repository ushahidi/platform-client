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
    $scope.formQuota = Config.features.limits.forms;

    $translate('nav.posts_and_entities').then(function (title) {
        $scope.title = title;
        $scope.$emit('setPageTitle', title);
    });

    // Get all the forms for display
    FormEndpoint.get().$promise.then(function (response) {
        $scope.forms = response.results;
    });

    // Manage new form settings
    $scope.isNewFormOpen = false;
    $scope.openNewForm = function () {
        $scope.newForm = {};
        $scope.isNewFormOpen = !$scope.isNewFormOpen;
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
                    $location.url('/settings/forms/' + form.id + '/stages/' + stage.id);
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
