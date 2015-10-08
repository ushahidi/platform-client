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
            form: FormEndpoint.save(form).$promise,
            label: $translate('form.structure_step')
        }).then(function (data) {
            form = data.form;
            var label = data.label,
                // create Structure stage
                stage = {label: label, required: '0', formId: form.id};

            // Save the Structure stage and go to the editor
            FormStageEndpoint
                .save(stage)
                .$promise
                .then(function (stage) {
                    $scope.isNewStageOpen = false;
                    $scope.newStage = {};
                    $translate('form.saved_form').then(function (message) {
                        Notify.showNotificationSlider(message);
                    });
                    $location.url('/settings/forms/' + form.id + '/stages/' + stage.id);
                });
        });
    };
    // End new form
}];
