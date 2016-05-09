module.exports = [
    '$translate',
    '$rootScope',
    '_',
    'Notify',
    'Util',
    'Languages',
    'Features',
function (
    $translate,
    $rootScope,
    _,
    Notify,
    Util,
    Languages,
    Features
) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
        },
        templateUrl: 'templates/settings/settings-list.html',
        link: function ($scope, $element, $attrs) {
        }
    };
}];
