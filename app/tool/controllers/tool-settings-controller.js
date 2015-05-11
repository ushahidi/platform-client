module.exports = [
    '$scope',
    '$rootScope',
    '$translate',
    'ConfigEndpoint',
    'Languages',
function (
    $scope,
    $rootScope,
    $translate,
    ConfigEndpoint,
    Languages
) {

    $translate('tool.site_settings').then(function (title) {
        $scope.title = title;
        $rootScope.$emit('setPageTitle', title);
    });

    $scope.saving_config = {};
    $scope.site = ConfigEndpoint.get({ id: 'site' });

    $scope.timezones = [];
    var timezones = require('moment-timezone/data/packed/latest.json');

    if (timezones.zones) {
        angular.forEach(timezones.zones, function (timezone) {
            timezone = timezone.split('|');
            $scope.timezones.push(timezone[0]);
        });
    }
    $scope.timezones.push('UTC');

    $scope.languages = Languages.RFC3066;

    $scope.updateConfig = function (id, model) {
        $scope.saving_config[id] = true;

        model.$update({ id: id }, function () {
            // @todo show alertify (or similar) message here
            $scope.saving_config[id] = false;
        });
    };

}];
