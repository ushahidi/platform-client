module.exports = [
    '$scope',
    '$translate',
    '$location',
    'FormEndpoint',
function (
    $scope,
    $translate,
    $location,
    FormEndpoint
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
        FormEndpoint
        .save(form)
        .$promise
        .then(function (form) {
            $scope.isNewFormOpen = false;
            $scope.newForm = {};
            $location.url('/settings/forms/' + form.id);
        });
    };
    // End new form

}];
