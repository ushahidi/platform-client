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
                // Add all entities to the array, but don't
                // break references that already refer to this array
                Array.prototype.splice.apply(
                    $scope.selectedSet,
                    [0, $scope.selectedSet.length].concat(_.pluck($scope.entities, 'id'))
                );
            };

            $scope.deselectAll = function () {
                // Empty the array, but don't break references that already refer to this array
                $scope.selectedSet.splice(0);
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
