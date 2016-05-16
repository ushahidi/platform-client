/*
 * Ushahidi Angular Filter System Post directive
 * Drop in directive for managing filters for posts
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
        templateUrl: 'templates/common/filter-system/filter-posts.html',
        scope: {
            query: '=',
            posts: '='
        },
        controller: controller
    };
}];
