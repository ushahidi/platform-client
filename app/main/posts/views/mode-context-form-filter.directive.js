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
ModeContextFormFilter.$inject = ['$scope', 'FormEndpoint', 'PostEndpoint', 'TagEndpoint', '$q', '_', '$rootScope', 'PostSurveyService', 'PostFilters', '$timeout', '$location'];
function ModeContextFormFilter($scope, FormEndpoint, PostEndpoint, TagEndpoint, $q, _, $rootScope, PostSurveyService, PostFilters, $timeout, $location) {
    $scope.forms = [];
    $scope.showOnly = showOnly;
    $scope.selectParent = selectParent;
    $scope.hide = hide;
    $scope.unknown_post_count = 0;
    $scope.hasManageSettingsPermission = $rootScope.hasManageSettingsPermission;
    $scope.canAddToSurvey = PostSurveyService.canCreatePostInSurvey;
    $scope.showLanguage = false;
    $scope.languageToggle = languageToggle;
    $scope.unmapped = 0;
    $scope.location = $location;
    $scope.goToUnmapped = goToUnmapped;
    $scope.getUnmapped = getUnmapped;
    activate();

    function activate() {
        // Load forms
        $scope.forms = FormEndpoint.queryFresh();
        $scope.tags = TagEndpoint.queryFresh();
        var postCountRequest = PostEndpoint.stats({ group_by: 'form', status: 'all' });
        $q.all([$scope.forms.$promise, postCountRequest.$promise, $scope.tags.$promise]).then(function (responses) {
            if (!responses[1] || !responses[1].totals || !responses[1].totals[0]) {
                return;
            }
            var values = responses[1].totals[0].values;
            var tags = responses[2];
            // adding children to tags
            _.each(tags, function (tag) {
                    if (tag.children) {
                        var children = [];
                        _.each(tag.children, function (child) {
                            _.each(tags, function (tag) {
                                if (tag.id === parseInt(child.id)) {
                                    children.push(tag);
                                }
                            });
                        });
                        tag.children = children;
                    }
                });
            angular.forEach($scope.forms, function (form) {
                var value = _.findWhere(values, { id: form.id });
                form.post_count = value ? value.total : 0;
            });

            $scope.forms.forEach(function (form, index) {
                // assigning whole tag-object to forms
                $scope.forms[index].tags = _.filter(tags, function (tag) {
                    if (tag.parent_id === null) {
                        return _.contains(form.tags, tag.id.toString());
                    }
                });
            });
            // Grab the count for form=null
            var unknownValue = _.findWhere(values, { id: null });
            if (unknownValue) {
                $scope.unknown_post_count = unknownValue.total;
            }
            // Setting nb of unmapped posts
            if (responses[1].unmapped) {
                $scope.unmapped = responses[1].unmapped;
            }
        });
    }
    function selectParent(parent) {
        if (_.contains($scope.filters.tags, parent.id)) {
            _.each(parent.children, function (child) {
                $scope.filters.tags.push(child.id);
            });
        } else {
            _.each(parent.children, function (child) {
                $scope.filters.tags = _.filter ($scope.filters.tags, function (id) {
                    return id !== child.id;
                });
            });
        }
    }
    function languageToggle() {
        $scope.showLanguage = !$scope.showLanguage;
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
        var filters = PostFilters.getDefaults();
        filters.form.push('none');
        filters.has_location = 'unmapped';
        PostFilters.setFilters(filters);
        $location.path('/views/list');
    }
    function hide(formId) {
        var index = $scope.filters.form.indexOf(formId);
        if (index !== -1) {
            $scope.filters.form.splice(index, 1);
        }
    }
}
