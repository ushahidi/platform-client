module.exports = [
    '$scope',
    '$rootScope',
    '$location',
    'DataExport',
    'Notify',
    'FormEndpoint',
    'FormAttributeEndpoint',
    '$q',
    '_',
    'LoadingProgress',
function (
    $scope,
    $rootScope,
    $location,
    DataExport,
    Notify,
    FormEndpoint,
    FormAttributeEndpoint,
    $q,
    _,
    LoadingProgress
) {
    $scope.exportAll = exportAll;
    $scope.showFields = false;
    $scope.showProgress = false;
    $scope.selectFields = selectFields;
    $scope.selectedFields = [];
    $scope.exportSelected = exportSelected;
    $scope.selectAll = selectAll;
    $scope.showForm = showForm;
    $scope.displayedForms = [];
    $scope.getForms = getForms;
    $scope.isLoading = LoadingProgress.getLoadingState;

    // hiding export-in-progress screen when export is complete
    $rootScope.$on('event:data_export:complete', function () {
        $scope.showProgress = false;
    });

    // Redirect to home if not authorized
    if ($rootScope.hasPermission('Bulk Data Import') === false) {
        return $location.path('/');
    }
    // Change layout class
    $rootScope.setLayout('layout-c');
    // Change mode
    $scope.$emit('event:mode:change', 'settings');

    function exportAll() {
        DataExport.prepareExport({format: 'csv'});
        $scope.showProgress = true;
    }

    function selectFields() {
        $scope.showFields = !$scope.showFields;
    }

    function getForms() {
        FormEndpoint.queryFresh().$promise.then(function (response) {
            $scope.forms = response;
        });
    }
    function exportSelected() {
        // todo, send the selected forms and attributes, question: in what format?
        DataExport.prepareExport({format: 'csv'});
    }

    function selectAll(form) {
        $scope.selectedFields[form.id] = !$scope.selectedFields[form.id] ? [] : $scope.selectedFields[form.id];
        if ($scope.selectedFields[form.id].length === form.attributes.length) {
            $scope.selectedFields[form.id] = [];
        } else {
            _.each(form.attributes, function (attribute) {
                if (!_.contains($scope.selectedFields[form.id], attribute.id)) {
                    $scope.selectedFields[form.id].push(attribute.id);
                }
            });
        }
    }
    function showForm(form) {
        // showing and hiding fields
        if (_.contains($scope.displayedForms, form.id)) {
            $scope.displayedForms = _.filter($scope.displayedForms, function (id) {
                return form.id !== id;
            });
        } else {
            $scope.displayedForms.push(form.id);
        }
        // fetching attributes if they are not already there
        if (!form.attributes) {
            FormAttributeEndpoint.queryFresh({formId: form.id}).$promise.then(function (response) {
                _.each($scope.forms, function (obj) {
                    if (form.id === obj.id) {
                        obj.attributes = response;
                    }
                });
            });
        }
    }

    getForms();
}];
