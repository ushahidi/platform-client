module.exports = [
    '$translate',
    '$rootScope',
    '$location',
    'WebhookEndpoint',
    '_',
    'Features',
function (
    $translate,
    $rootScope,
    $location,
    WebhookEndpoint,
    _,
    Features
) {
    return {
        restrict: 'A',
        link: function ($scope, $element, $attrs) {
            $rootScope.setLayout('layout-a');

            $scope.refreshView = function () {
                WebhookEndpoint.queryFresh().$promise.then(function (webhooks) {
                    $scope.webhooks = webhooks;
                });
            };

            $scope.refreshView();
            Features.loadFeatures().then(function () {
                $scope.webhooksEnabled = Features.isFeatureEnabled('webhooks');
            });
        }
    };
}];
