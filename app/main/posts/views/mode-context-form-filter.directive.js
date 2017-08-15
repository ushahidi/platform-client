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
    $scope.changeForms = changeForms;
    activate();

    function activate() {
        // Load forms
        $scope.forms = FormEndpoint.queryFresh();
        $scope.tags = TagEndpoint.queryFresh();
        var postCountRequest = PostEndpoint.stats({ group_by: 'form', status: 'all', include_unmapped: true });
        $q.all([$scope.forms.$promise, postCountRequest.$promise, $scope.tags.$promise]).then(function (responses) {
            if (!responses[1] || !responses[1].totals || !responses[1].totals[0]) {
                return;
            }
            var values = responses[1].totals[0].values;
            var tags = responses[2];
            // adding children to tags
            _.each(_.where(tags, { parent_id: null }), function (tag) {
                if (tag && tag.children) {
                    tag.children = _.filter(_.map(tag.children, function (child) {
                        return _.findWhere(tags, {id: parseInt(child.id)});
                    }));
                }
            });

            angular.forEach($scope.forms, function (form) {
                var value = _.findWhere(values, { id: form.id });
                form.post_count = value ? value.total : 0;
            });

            $scope.forms.forEach(function (form, index) {
                var formTagIds = _.pluck(form.tags, 'id');
                // assigning whole tag-object to forms
                $scope.forms[index].tags = _.filter(_.map(tags, function (tag) {
                    // Remove children
                    if (tag.parent_id === null) {
                        tag = _.clone(tag);
                        tag.children = _.clone(tag.children);

                        // Grab the tags selected for this form
                        if (_.contains(formTagIds, tag.id)) {
                            // Filter the children based on form.tags
                            tag.children = _.filter(tag.children, function (child) {
                                return _.contains(formTagIds, child.id);
                            });

                            return tag;
                        }
                    }

                    return false;
                }));
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

    function selectParent(parent, formId) {
        // If we've just selected the tag
        if (_.contains($scope.filters.tags, parent.id)) {
            // ... then select its children too
            _.each(parent.children, function (child) {
                $scope.filters.tags.push(child.id);
            });

            // Also filter to just this form
            $scope.filters.form.splice(0, $scope.filters.form.length, formId);
        // Or if we're deselecting the parent
        } else {
            // Deselect the children too
            _.each(parent.children, function (child) {
                // Remove each child without replacing the tags array
                var index = $scope.filters.tags.indexOf(child.id);
                if (index !== -1) {
                    $scope.filters.tags.splice(index, 1);
                }
            });
        }
    }

    function languageToggle() {
        $scope.showLanguage = !$scope.showLanguage;
    }

    function showOnly(formId) {
        $scope.filters.form.splice(0, $scope.filters.form.length, formId);
        // Remove tags filter
        $scope.filters.tags.splice(0, $scope.filters.tags.length);
    }

    function changeForms() {
        if ($scope.forms.length > 1) {
            // Remove tags filter
            $scope.filters.tags.splice(0, $scope.filters.tags.length);
        }
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
