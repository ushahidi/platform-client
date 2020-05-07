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
ModeContextFormFilter.$inject = ['$scope', 'PostEndpoint', '$q', '_', '$rootScope', 'PostSurveyService', 'PostFilters', '$location', 'UshahidiSdk',
'Session', 'Util', 'TranslationService'];
function ModeContextFormFilter($scope, PostEndpoint, $q, _, $rootScope, PostSurveyService, PostFilters, $location, UshahidiSdk, Session, Util, TranslationService) {
    $scope.forms = [];
    $scope.showOnly = showOnly;
    $scope.hide = hide;
    $scope.hasManageSettingsPermission = $rootScope.hasManageSettingsPermission;
    $scope.canAddToSurvey = PostSurveyService.canCreatePostInSurvey;
    $scope.showLanguage = false;
    $scope.languageToggle = languageToggle;
    $scope.unmapped = 0;
    $scope.location = $location;
    $scope.goToUnmapped = goToUnmapped;
    $scope.unknown = [];

    activate();
    $rootScope.$on('language:changed', function () {
        getUserLanguage();
    });

    // whenever filters change, reload the stats
    $scope.$watch(function (changed) {
        return $scope.filters;
    }, function (newValue, oldValue) {
        var diff = _.omit(newValue, function (value, key, obj) {
            return _.isEqual(oldValue[key], value);
        });
        var diffLength = _.keys(diff).length;

        if (diffLength > 0) {
            getPostStats(PostFilters.getFilters()).$promise.then(updateCounts);
        }
    }, true);

    function activate() {
        // Load forms
        // $scope.forms = FormEndpoint.query();
        const token = Session.getSessionDataEntry('accessToken');
        const ushahidi = new UshahidiSdk.Surveys(Util.url(''), token);
        ushahidi.getSurveys().then(surveys=>{
            $scope.forms = surveys;
        });
        getUserLanguage();
        var postCountRequest = getPostStats($scope.filters);
        $q.all([$scope.forms.$promise, postCountRequest.$promise]).then(function (responses) {
            if (!responses[1] || !responses[1].totals || !responses[1].totals[0]) {
                return;
            }
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

        // deleting source, we want stats for all datasources to keep the datasource-bucket-stats unaffected by data-source-filters
        if (queryParams.source) {
            delete queryParams.source;
        }
        return PostEndpoint.stats(queryParams);
    }

    function getUserLanguage () {
        TranslationService.getLanguage().then(language => {
            $scope.userLanguage = language;
        });
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
                    return count;
                }, sourceStat.total);
                sourceStat.type = provider;
                sourceStats.push(sourceStat);
            }
        });
        return sourceStats;
    }

    function languageToggle() {
        $scope.showLanguage = !$scope.showLanguage;
    }

    function showOnly(formId) {
        $scope.filters.form.splice(0, $scope.filters.form.length, formId);
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
