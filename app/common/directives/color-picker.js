/**
* Ushahidi Angular Color Picker directive
* Drop in directive for color picking
*/

module.exports = [
    function() {
        var controller = [
            '$scope',
            '$translate',
            function(
                $scope,
                $translate
            ) {
                $scope.colorContainer.color = '';
                $scope.setColor = function(color) {
                    $scope.colorContainer.color = color;
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
