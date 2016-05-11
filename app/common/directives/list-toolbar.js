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
        '$q',
        '$translate',
        'Notify',
        '_',
        function (
            $scope,
            $rootScope,
            $q,
            $translate,
            Notify,
            _
        ) {

            $scope.selectAll = function () {
                $scope.selectedSet = _.pluck($scope.entities, 'id');
            };

            $scope.deselectAll = function () {
                $scope.selectedSet = [];
            };

            $scope.deleteSet = function () {
                //TODO: update message to be generic
                $translate('notify.tag.bulk_destroy_confirm', {
                    count: $scope.selectedEntity.length
                }).then(function (message) {
                    Notify.showConfirm(message).then(function () {
                        var calls = [];
                        angular.forEach($scope.selectedSet, function (entityId) {
                            calls.push($scope.entityEndpoint.delete({ id: entityId }).$promise);
                        });
                        $q.all(calls).then(function () {
                            // TODO: update message to be generic
                            $translate('notify.tag.bulk_destroy_success', {
                                count: $scope.selectedSet.length
                            }).then(function (message) {
                                Notify.showNotificationSlider(message);
                            });
                            $scope.refreshView();
                        });
                    });
                });
            };
        }];
    return {
        restrict: 'E',
        templateUrl: 'templates/common/listing-toolbar.html',
        scope: {
            collectionEnabled: '=',
            visibilityEnabled: '=',
            entityEndpoint: '=',
            entities: '=',
            selectedSet: '='
        },
        controller: controller
    };
}];
