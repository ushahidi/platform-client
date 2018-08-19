module.exports = DemoDeploymentDirective;

DemoDeploymentDirective.$inject = [];
function DemoDeploymentDirective() {
    return {
        restrict: 'E',
        scope: {},
        controller: DemoDeploymentController,
        template: require('./demo-deployment.html')
    };
}

DemoDeploymentController.$inject = [
    '$scope',
    '$rootScope',
    '$location',
    'ConfigEndpoint',
    'PostEndpoint',
    'moment'
];
function DemoDeploymentController(
    $scope,
    $rootScope,
    $location,
    ConfigEndpoint,
    PostEndpoint,
    moment
) {

    var USHAHIDI = 'Ushahidi';

    $scope.limitReached = false;
    $scope.expired = false;
    $scope.days_remaining = 30;
    $scope.loggedin = $rootScope.loggedin;

    $scope.upgrade = upgrade;
    activate();

    function activate() {
        ConfigEndpoint.get({id: 'site'}).$promise.then(function (site) {
            $scope.site_name = site.name ? site.name : USHAHIDI;
            var expiration_date = moment(site.expiration_date);
            var extension_date = site.extension_date ? moment(site.extension_date) : null;
            var now = moment();

            $scope.expired = now > expiration_date;

            if ($scope.expired && extension_date) {
                $scope.expired = now > extension_date;
                $scope.extension_days_remaining = extension_date.diff(now, 'days');
            }

            if (!$scope.expired) {
                $scope.days_remaining = $scope.extension_days_remaining ? $scope.extension_days_remaining : expiration_date.diff(now, 'days');
                PostEndpoint.stats().$promise.then(function (results) {
                    if (results.totals[0]) {
                        $scope.limitReached = results.totals[0].values[0].total >= 25;
                    }
                });
            }
        });

    }

    function upgrade() {
        $location.path('settings/plans');
    }
}
