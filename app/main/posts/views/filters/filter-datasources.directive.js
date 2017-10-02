module.exports = FilterDatasourcesDirective;

FilterDatasourcesDirective.$inject = [];
function FilterDatasourcesDirective() {
    return {
        restrict: 'E',
        scope: {
            filters: '=',
            postStats: '='
        },
        controller: FilterDatasourcesController,
        template: require('./filter-datasources.html')
    };
}

FilterDatasourcesController.$inject = ['$scope', '$rootScope', 'ConfigEndpoint', '_', '$location', 'PostEndpoint', 'PostFilters'];
function FilterDatasourcesController($scope, $rootScope, ConfigEndpoint, _, $location, PostEndpoint, PostFilters) {
    $scope.dataSources = [];
    $scope.providers = [];
    $scope.featureEnabled = featureEnabled;

    function featureEnabled() {
        return $rootScope.hasPermission('Manage Posts');
    }

    activate();

/*
    function getSourceStats(stats) {
        var sourceStats = [];
        var providers = ['email', 'sms', 'twitter'];
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
    }*/

    function activate() {
        if ($scope.featureEnabled()) {
            var query = PostFilters.getQueryParams(PostFilters.getFilters());
            var queryParams = _.extend({}, query, {
                'group_by': 'form',
                include_unmapped: true
            });

            // we want stats for all forms, not just the ones visible right now
            if (queryParams.form) {
                delete queryParams.form;
            }
            // deleting categories and sources since they are selected in the sidebar and not in the filter-modal = might get confusing
            if (queryParams.tags) {
                delete queryParams.tags;
            }
            // deleting source, we want stats for all datasources to keep the datasource-bucket-stats unaffected by data-source-filters
            if (queryParams.source) {
                delete queryParams.source;
            }
            PostEndpoint.stats(queryParams).$promise.then(function(stats) {
                $scope.postStats = stats;
                console.log(assignStatsToProviders());
            });
            ConfigEndpoint.get({ id: 'data-provider' }).$promise.then(function (results) {
                $scope.dataSources = results.providers;
                console.log($scope.dataSources);

                //assignStatsToProviders();
            });
        }
    }

    function assignStatsToProviders() {
        $scope.providers = _.map($scope.postStats, function (provider) {
            var obj = {};
            if (provider.type !== 'web') {
                obj.label = provider.type === 'sms' ? 'SMS' : provider.type.substr(0, 1).toUpperCase() + provider.type.substr(1);
                return obj;
            }
        });

        // removing duplicates and null-values
        $scope.providers = _.chain($scope.providers)
            .compact()
            .uniq()
            .value();
        return $scope.providers;
    }


}
