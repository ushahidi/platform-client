module.exports = FilterByDatasourceDirective;

FilterByDatasourceDirective.$inject = [];
function FilterByDatasourceDirective() {
    return {
        restrict: 'E',
        scope: {
            filters: '=',
            postStats: '='
        },
        replace: true,
        controller: FilterByDatasourceController,
        template: require('./filter-by-datasource.html')
    };
}

FilterByDatasourceController.$inject = ['$scope', '$rootScope', 'ConfigEndpoint', '_', '$location'];
function FilterByDatasourceController($scope, $rootScope, ConfigEndpoint, _, $location) {
    $scope.dataSources = [];
    $scope.providers = [];
    $scope.formatHeading = formatHeading;
    $scope.showOnly = showOnly;
    $scope.hide = hide;
    $scope.featureEnabled = featureEnabled;
    $scope.showOnlyIncoming = showOnlyIncoming;
    $scope.assignStatsToProviders = assignStatsToProviders;
    $scope.getTotals = getTotals;
    $scope.toggleFilters = toggleFilters;
    $scope.$watch('postStats', function (postStats) {
        assignStatsToProviders();
    });

    activate();

    function activate() {
        if ($scope.featureEnabled()) {
            ConfigEndpoint.get({ id: 'data-provider' }).$promise.then(function (results) {
                $scope.dataSources = results.providers;
                assignStatsToProviders();
            });
        }
    }

    function toggleFilters(filter) {
        var index = $scope.filters.source.indexOf(filter);
        if (index !== -1) {
            $scope.filters.source.splice(index, 1);
        } else {
            $scope.filters.source.push(filter);
        }
    }

    function assignStatsToProviders() {
        $scope.providers = _.map($scope.postStats, function (provider) {
                var obj = {};
                obj.label = provider.type === 'sms' ? 'SMS' : provider.type.substr(0, 1).toUpperCase() + provider.type.substr(1);
                obj.heading = formatHeading(obj.label);
                obj.total = getTotals(provider.type);
                return obj;
            });

        // removing duplicates and null-values
        $scope.providers = _.chain($scope.providers)
            .compact()
            .uniq()
            .value();

        // if user is logged in and is allowed to see the configs,
        // we add all enabled datasources, even if there are 0 posts
        if ($scope.dataSources) {
            var smsProviders = ['nexmo', 'twilio', 'frontlinesms', 'smssync'];
            _.each($scope.dataSources, function (source, key) {
                    if (source) {
                        var type = _.contains(smsProviders, key) ? 'SMS' : key.substr(0, 1).toUpperCase() + key.substr(1);
                        var exists = _.filter($scope.providers, { label: type });
                        if (exists.length < 1) {
                            var obj = {};
                            obj.label = type;
                            obj.heading = formatHeading(obj.label);
                            obj.total = getTotals(key); // Isn't this always 0?
                            $scope.providers.push(obj);
                        }
                    }
                });
        }

        $scope.providers = _.sortBy($scope.providers, 'label');
    }

    function getTotals(source) {
        var stats = _.findWhere($scope.postStats, {type: source.toLowerCase()});
        if (stats && stats.total) {
            return stats.total;
        }
        return 0;
    }


    function formatHeading(name) {
        switch (name) {
            case 'Twitter':
                return 'Tweets';
            case 'SMS':
                return 'SMS';
            case 'Email':
                return 'Emails';
            case 'Web':
                return 'Web';
            default:
                return ' ';
        }
    }

    function showOnly(source) {
        if ($scope.filters.form.indexOf('none') < 0) {
            $scope.filters.form.push('none');
        }
        $scope.filters.source = [source.toLowerCase()];
    }

    function hide(source) {
        var index = $scope.filters.source.indexOf(source.toLowerCase());
        if (index !== -1) {
            $scope.filters.source = [];
            _.each($scope.providers, function (provider) {
                if (provider.label !== source) {
                    $scope.filters.source.push(provider.label.toLowerCase());
                }
            });
        }
    }

    function showOnlyIncoming(source) {
        $scope.filters.form = ['none'];
        $scope.filters.source = [source.toLowerCase()];
        $location.path('/views/data');
    }

    function featureEnabled() {
        return $rootScope.hasPermission('Manage Posts');
    }
}
