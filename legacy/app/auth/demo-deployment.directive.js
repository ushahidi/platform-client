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
    'dayjs'
];
function DemoDeploymentController(
    $scope,
    $rootScope,
    $location,
    ConfigEndpoint,
    PostEndpoint,
    dayjs
) {

    var USHAHIDI = 'Ushahidi';

    $scope.limitReached = false;
    $scope.expired = false;
    $scope.days_remaining = 30;
    $scope.loggedin = $rootScope.loggedin;
    $scope.upgrade = upgrade;
    $scope.close = function close() {
        $rootScope.toggleModalVisible(false, true);
        $rootScope.$emit('demoslider:close');
    };

    activate();

    function activate() {
        ConfigEndpoint.get({id: 'site'}).$promise.then(function (site) {
            $scope.site_name = site.name ? site.name : USHAHIDI;
            var expiration_date = dayjs(site.expiration_date);
            var extension_date = site.extension_date ? dayjs(site.extension_date) : null;
            var now = dayjs();

            $scope.expired = now > expiration_date;

            if ($scope.expired) {
                $scope.expired = now > extension_date;
            }

            $rootScope.$broadcast('demo:limitAvailability', $scope.expired, $scope.limitReached);

            if (!$scope.expired) {
                $scope.days_remaining = extension_date ? extension_date.diff(now, 'days') : expiration_date.diff(now, 'days');
                PostEndpoint.stats().$promise.then(function (results) {
                    if (results.totals[0]) {
                        $scope.limitReached = results.totals[0].values[0].total >= 25;
                        $rootScope.$broadcast('demo:limitAvailability', $scope.expired, $scope.limitReached);
                    }
                });
            }
        });
    }

    function upgrade() {
        $location.path('settings/plans');
    }
}
