module.exports = [
    '$scope',
    '$translate',
    '$location',
    '$q',
    'FormEndpoint',
    'FormStageEndpoint',
    'Notify',
function (
    $scope,
    $translate,
    $location,
    $q,
    FormEndpoint,
    FormStageEndpoint,
    Notify
) {

    $translate('nav.posts_and_entities').then(function (title) {
        $scope.title = title;
        $scope.$emit('setPageTitle', title);
    });

    // Get all the forms for display
    $scope.refreshForms = function () {
        FormEndpoint.get().$promise.then(function (response) {
            $scope.forms = response.results;
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
        });
    };
    // End new form
}];
