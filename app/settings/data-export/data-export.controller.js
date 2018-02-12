module.exports = [
    '$scope',
    '$rootScope',
    '$location',
    'DataExport',
    'Notify',
    'FormEndpoint',
    'FormAttributeEndpoint',
    '$q',
function (
    $scope,
    $rootScope,
    $location,
    DataExport,
    Notify,
    FormEndpoint,
    FormAttributeEndpoint,
    $q
) {
    $scope.exportAll = exportAll;
    $scope.showFields = false;
    $scope.selectFields = selectFields;
    // Redirect to home if not authorized
    if ($rootScope.hasManageSettingsPermission() === false) {
        return $location.path('/');
    }
    // Change layout class
    $rootScope.setLayout('layout-c');
    // Change mode
    $scope.$emit('event:mode:change', 'settings');
         
    function exportAll () {
            Notify.confirm('notify.post.export').then(function (message) {
            DataExport.prepareExport({format: 'csv'});
        });
    }

    function selectFields () {
        $scope.showFields = !$scope.showFields;
    }
    function getForms () {
        FormEndpoint.queryFresh().$promise.then(function (response) {
            $scope.forms = response;
            var attributeQueries = [];
            $scope.forms.forEach(function(form) {
                attributeQueries.push(FormAttributeEndpoint.query({formId: form.id}));
            });
            $q.all(attributeQueries).then(function(results) {
                results.forEach(function(result, index){
                    /* I am not sure if we can do this, can I trust the results come in the same order
                    so I can use the result index with the $scope.form[index]? Or do 
                    we need to go through form-stage-id? :scream: */
                    $scope.forms[index].attributes = result;
                });
            });
        });
    }

    getForms();
}];
