/**
* Ushahidi Angular Color Picker directive
* Drop in directive for color picking
*/

module.exports = [
    function () {
        var controller = [
            '$scope',
            '$translate',
            function (
                $scope,
                $translate
            ) {
                // Update local color when inbound color is changed
                $scope.$watch('colorContainer.color', function () {
                    if ($scope.colorContainer.color) {
                        $scope.color = $scope.colorContainer.color.replace('#', '');
                    }
                });

                $scope.setColor = function (color) {
                    $scope.colorContainer.color = color.indexOf('#') > -1 ? color : '#' + color;
                };
            }
        ];
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'templates/common/color-picker/color-picker.html',
            scope: {
                colorContainer: '='
            },
            controller: controller
        };
    }
];
