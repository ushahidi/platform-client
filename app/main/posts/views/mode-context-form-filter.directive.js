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
    $scope.hasManageSettingsPermission = $rootScope.hasManageSettingsPermission;
    $scope.canAddToSurvey = PostSurveyService.canCreatePostInSurvey;
    $scope.showLanguage = false;
    $scope.languageToggle = languageToggle;
    $scope.unmapped = 0;
    $scope.location = $location;
    $scope.goToUnmapped = goToUnmapped;
    $scope.getUnmapped = getUnmapped;
    $scope.changeForms = changeForms;
    $scope.unknown = [];

    activate();
    /**
     * TODO this needs refactoring about refactoring the  qenabled/reactivefilters situation
     * since it might get out of hand as we need it in multiple places.
     */
    $scope.$watch(function () {
        return PostFilters.qEnabled;
    }, function () {
        if (PostFilters.qEnabled === true) {
            $scope.filters.reactToQEnabled = $scope.filters.reactToQEnabled ? !$scope.filters.reactToQEnabled : true;
        }
    });

    // whenever filters change, reload the stats
    $scope.$watch(function () {
        return $scope.filters;
    }, function (newValue, oldValue) {
        var diff = _.omit(newValue, function (value, key, obj) {
            return _.isEqual(oldValue[key], value);
        });
        var diffLength = _.keys(diff).length;
        var qDiffOnly =  _.keys(diff).length === 1 && diff.hasOwnProperty('q');
        /**
         * We only want to call updateCounts if we :
         * - Have changes other than q= in the filters
         * - Only q= changed but we also have enabled the q filter
         */
        if (diffLength > 0 && !qDiffOnly || (diffLength >= 1 && PostFilters.qEnabled === true)) {
            getPostStats(PostFilters.getFilters()).$promise.then(updateCounts);
        }
        if (PostFilters.qEnabled === true) {
            PostFilters.qEnabled = false;
        }
    }, true);

    function activate() {
        // Load forms
        $scope.forms = FormEndpoint.query();
        $scope.tags = TagEndpoint.query();
        var postCountRequest = getPostStats($scope.filters);
        $q.all([$scope.forms.$promise, postCountRequest.$promise, $scope.tags.$promise]).then(function (responses) {
            if (!responses[1] || !responses[1].totals || !responses[1].totals[0]) {
                return;
            }
            var tags = responses[2];

            // adding children to tags
            _.each(_.where(tags, { parent_id: null }), function (tag) {
                if (tag && tag.children) {
                    tag.children = _.filter(_.map(tag.children, function (child) {
                        return _.findWhere(tags, {id: parseInt(child.id)});
                    }));
                }
            });

            angular.forEach($scope.forms, function (form, index) {
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

            updateCounts(responses[1]);
        });
    }

    function getPostStats(filters) {
        var query = PostFilters.getQueryParams(filters);
        var queryParams = _.extend({}, query, {
            'group_by': 'form',
            include_unmapped: true
        });

        // we want stats for all forms, not just the ones visible right now
        if (queryParams.form) {
            delete queryParams.form;
        }
        // deleting categories and sources since they are
        // selected in the sidebar and not in the filter-modal = might get confusing
        if (queryParams.tags) {
            delete queryParams.tags;
        }
        // deleting source, we want stats for all datasources to keep the datasource-bucket-stats unaffected by data-source-filters
        if (queryParams.source) {
            delete queryParams.source;
        }
        return PostEndpoint.stats(queryParams);
    }

    function updateCounts(stats) {
        // assigning count for different data-sources
        $scope.sourceStats = getSourceStats(stats);
        // Setting nb of unmapped posts
        $scope.unmapped = stats.unmapped ? stats.unmapped : 0;
        // assigning count for all forms
        _.each($scope.forms, function (form) {
            let posts = _.filter(stats.totals[0].values, function (value) {
                // checking source-type, hack to keep the stats in data-source-buckets the same even if adding a source-filter.
                return value.id === form.id && _.contains($scope.filters.source, value.type);
            });

            form.post_count = 0;
            // calculating totals
            if (posts) {
                form.post_count = _.reduce(posts, function (count, post) {
                    if (post.total) {
                        return count + post.total;
                    }
                    return 0;
                }, form.post_count);
            }
        });
    }

    function getSourceStats(stats) {
        var sourceStats = [];
        var providers = ['email', 'sms', 'twitter', 'web'];
        // calculating stats for each datasource, based on the current form-filter
        _.each(providers, function (provider) {
            var posts = _.filter(stats.totals[0].values, function (value) {
                    // including posts without a form in the stats
                    var id = value.id === null ? 'none' : value.id;
                    return value.type === provider && _.contains($scope.filters.form, id);
                });

            if (posts && posts.length > 0) {
                var sourceStat = {total: 0};
                sourceStat.total = _.reduce(posts, function (count, post) {
                    if (post.total) {
                        return count + post.total;
                    }
                    return 0;
                }, sourceStat.total);
                sourceStat.type = provider;
                sourceStats.push(sourceStat);
            }
        });
        return sourceStats;
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
        $location.path('/views/data');
    }

    function hide(formId) {
        var index = $scope.filters.form.indexOf(formId);
        if (index !== -1) {
            $scope.filters.form.splice(index, 1);
        }
    }
}
