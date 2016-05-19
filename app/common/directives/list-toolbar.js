/**
 * Ushahidi Listing Toolbar directive
 * Drop in directive for managing listing toolbar operations
 * Options are: select all, deselect all, delete, set visibility, add to collection
 */

module.exports = [
function (
) {
    var controller = [
        '$scope',
        '$rootScope',
        '$translate',
        '_',
        function (
            $scope,
            $rootScope,
            $translate,
            _
        ) {

            $scope.selectAll = function () {
                $scope.selectedSet = _.pluck($scope.entities, 'id');
            };

            $scope.deselectAll = function () {
                $scope.selectedSet = [];
            };

        }];
    return {
        restrict: 'E',
        templateUrl: 'templates/common/listing-toolbar.html',
        replace: true,
        transclude: true,
        scope: {
            entities: '=',
            selectedSet: '='
        },
        controller: controller
    };
}];
