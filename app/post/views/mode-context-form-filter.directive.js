module.exports = ModeContextFormFilterDirective;

ModeContextFormFilterDirective.$inject = [];
function ModeContextFormFilterDirective() {
    return {
        restrict: 'E',
        scope: true,
        controller: ModeContextFormFilter,
        templateUrl: 'templates/posts/views/mode-context-form-filter.html'
    };
}

ModeContextFormFilter.$inject = ['$scope', 'FormEndpoint', 'PostEndpoint', '$q', '_', '$rootScope'];
function ModeContextFormFilter($scope, FormEndpoint, PostEndpoint, $q, _, $rootScope) {
    $scope.forms = [];
    $scope.showOnly = showOnly;
    $scope.hide = hide;
    $scope.unknown_post_count = 0;
    $scope.hasManageSettingsPermission = $rootScope.hasManageSettingsPermission;

    activate();

    function activate() {
        // Load forms
        $scope.forms = FormEndpoint.query();
        var postCountRequest = PostEndpoint.stats({ group_by: 'form', status: 'all' });

        $q.all([$scope.forms.$promise, postCountRequest.$promise]).then(function (responses) {
            if (!responses[1] || !responses[1].totals || !responses[1].totals[0]) {
                return;
            }
            var values = responses[1].totals[0].values;

            angular.forEach($scope.forms, function (form) {
                var value = _.findWhere(values, { id: form.id });
                form.post_count = value ? value.total : 0;
            });

            // Grab the count for form=null
            var unknownValue = _.findWhere(values, { id: null });
            if (unknownValue) {
                $scope.unknown_post_count = unknownValue.total;
            }
        });
    }

    function showOnly(formId) {
        $scope.filters.form.splice(0, $scope.filters.form.length, formId);
    }

    function hide(formId) {
        var index = $scope.filters.form.indexOf(formId);
        if (index !== -1) {
            $scope.filters.form.splice(index, 1);
        }
    }
}
