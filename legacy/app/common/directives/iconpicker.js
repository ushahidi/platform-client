/**
 * Ushahidi Angular Icon Pocker directive
 * Based on the Angular Bootstrap Icon Picker directive
 */

module.exports = [
    'IconManager',
function (
    IconManager
) {
    return {
        restrict: 'E',
        template: require('./iconpicker.html'),
        replace: true,
        scope: {
            model: '=?ngModel',
            iconLibName: '='
        },

        link: function ($scope, $element, $attrs) {
            $scope.iconSet = IconManager.getIconSetArray($attrs.iconLibName);

            $scope.setIcon = function (icon) {
                $scope.model = icon;
            };
        }
    };
}];

