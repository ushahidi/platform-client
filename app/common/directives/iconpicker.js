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
        templateUrl: 'templates/iconpicker/iconpicker.html',

        scope: {
            model: '=?ngModel',
            iconLibName: '='
        },

        link: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
            $scope.iconSet = IconManager.getIconSetArray($scope.iconLibName);
        }]
    };
}];

