/**
 * Ushahidi Angular Filter System Master directive
 * Drop in directive master directive responsible for search
 * and selection of appropriate sub directive
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
            $scope.search_placeholder = 'toolbar.' + $scope.entityType + '.search_' + $scope.entityType;
            $scope.query = {
                q: ''
            };

            $scope.search = function (query) {
                $scope.query.q = query;
            };

        }];
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'templates/common/filter-system/filter-system.html',
        scope: {
            entityType: '=',
            entities: '='
        },
        controller: controller
    };
}];
