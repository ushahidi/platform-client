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
    '$location',
    'ConfigEndpoint',
    'PostEndpoint',
    'moment'
];
function DemoDeploymentController(
    $scope,
    $location,
    ConfigEndpoint,
    PostEndpoint,
    moment
) {

    var USHAHIDI = 'Ushahidi';

    $scope.limitReached = false;
    $scope.expired = false;
    $scope.days_remaining = 30;

    $scope.upgrade = upgrade;
    activate();

    function activate() {
        ConfigEndpoint.get({id: 'site'}).$promise.then(function (site) {
            $scope.site_name = site.name ? site.name : USHAHIDI;
            var expiration_date = moment(site.expiration_date);
            var extension_date = moment(site.extension_date);
            var now = moment();

            $scope.expired = now > expiration_date || now > extension_date;

            if (!$scope.expired) {
                $scope.days_remaining = expiration_date.diff(extension_date, 'days');
                PostEndpoint.stats().$promise.then(function (results) {
                    if (results.totals[0]) {
                        $scope.limitReached = results.totals.values.totals >= 25;
                    }
                });
            }
        });

    }

    function upgrade() {
        $location.path('settings/plans');
    }
}
