module.exports = ModeContextFormFilterDirective;

ModeContextFormFilterDirective.$inject = [];
function ModeContextFormFilterDirective() {
    return {
        restrict: 'E',
        scope: true,
        controller: ModeContextFormFilter,
        template: require('./mode-context-form-filter.html')
    };
}

ModeContextFormFilter.$inject = ['$scope', 'FormEndpoint', 'PostEndpoint', '$q', '_', '$rootScope', 'PostSurveyService', 'PostFilters', '$timeout', '$location'];
function ModeContextFormFilter($scope, FormEndpoint, PostEndpoint, $q, _, $rootScope, PostSurveyService, PostFilters, $timeout, $location) {
    $scope.forms = [];
    $scope.showOnly = showOnly;
    $scope.hide = hide;
    $scope.unknown_post_count = 0;
    $scope.hasManageSettingsPermission = $rootScope.hasManageSettingsPermission;
    $scope.canAddToSurvey = PostSurveyService.canCreatePostInSurvey;
    $scope.PostFilters = PostFilters;
    $scope.unmapped = 0;
    $scope.location = $location;
    $scope.goToUnmapped = goToUnmapped;
    $scope.getUnmapped = getUnmapped;
    activate();

    function activate() {
        // Load forms
        $scope.forms = FormEndpoint.query();
        var postCountRequest = PostEndpoint.stats({ group_by: 'form', status: 'all' });
        // todo: can I limit this to only returning 'unmapped'?
        // todo: How about the requests? Do I need to check auth first before searching for draft?
        var unmappedRequest = PostEndpoint.geojson({status: ['published', 'draft']});
        $q.all([$scope.forms.$promise, postCountRequest.$promise, unmappedRequest.$promise]).then(function (responses) {
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
            // Setting nb of unmapped posts
            if (responses[2] && responses[2].unmapped) {
                $scope.unmapped = responses[2].unmapped;
            }
        });
    }

    function showOnly(formId) {
        $scope.filters.form.splice(0, $scope.filters.form.length, formId);
    }
    function getUnmapped() {
        if ($scope.unmapped === 1) {
            return $scope.unmapped + ' post';
        }
        return $scope.unmapped + ' posts';
    }

    function goToUnmapped() {
        $scope.PostFilters.setFilters({unmapped: true});
        $location.path('/views/list');
    }
    function hide(formId) {
        var index = $scope.filters.form.indexOf(formId);
        if (index !== -1) {
            $scope.filters.form.splice(index, 1);
        }
    }
}
