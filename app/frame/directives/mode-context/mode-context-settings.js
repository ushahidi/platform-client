module.exports = [
    'ConfigEndpoint',
function (
    ConfigEndpoint
) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            settingsView: '=',
            viewType: '='
        },
        templateUrl: 'templates/frame/mode-context/mode-context-settings.html',
        link: function ($scope, $element, $attrs) {
            ConfigEndpoint.get({ id: 'site' }).$promise.then(function (site) {
                $scope.site = site;
            });
        }
    };
}];
