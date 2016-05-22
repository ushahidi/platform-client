/*
 * Ushahidi Angular Filter System Category directive
 * Drop in directive for managing filters for categories
 */

module.exports = [
function (
) {
    var controller = [
        '$scope',
        '$rootScope',
        '$translate',
        'Notify',
        'RoleEndpoint',
        '_',
        function (
            $scope,
            $rootScope,
            $translate,
            Notify,
            RoleEndpoint,
            _
        ) {

            $scope.cancel = function () {
            };

            $scope.applyFilters = function () {
            };
        }];
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'templates/common/filter-system/filter-categories.html',
        scope: {
            query: '=',
            categories: '='
        },
        controller: controller
    };
}];
