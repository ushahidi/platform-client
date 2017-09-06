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

FilterByDatasourceController.$inject = ['$scope', '$rootScope', 'ConfigEndpoint', '_'];
function FilterByDatasourceController($scope, $rootScope, ConfigEndpoint, _) {

    $scope.$watch('postStats', function (postStats) {
        assignStatsToProviders();
    });
    $scope.dataSources = [];
    $scope.providers = [];
    $scope.formatHeading = formatHeading;
    $scope.showOnly = showOnly;
    $scope.hide = hide;

    activate();

    function activate() {
        ConfigEndpoint.get({ id: 'data-provider' }).$promise.then(function (results) {
            $scope.dataSources = results.providers;
            assignStatsToProviders();
        });
    }
    function assignStatsToProviders() {
        var smsProviders = ['smssync', 'twilio', 'frontlinesms'];
        $scope.providers = _.map($scope.dataSources, function (source, key) {
                    var obj = {};
                    if (source) {
                        if (_.contains(smsProviders, key)) {
                            obj.label =  'SMS';
                        } else {
                            obj.label = key.substr(0, 1).toUpperCase() + key.substr(1);
                        }
                        obj.total = getTotals(obj.label);
                        obj.heading = formatHeading(obj.label);
                        return obj;
                    }
                });

        $scope.providers = _.chain($scope.providers)
            .compact()
            .uniq()
            .value();
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
}
