module.exports = [
    '$rootScope',
    'ModalService',
    'PostFilters',
function (
    $rootScope,
    ModalService,
    PostFilters
) {
    return {
        restrict: 'E',
        template: require('./savedsearch-create.html'),
        link: function ($scope, $element, $attrs) {

            // Init an empty saved search
            $scope.savedSearch = {
                view : 'map',
                role : []
            };

            // Compare current filters to default filters
            $scope.hasFilters = function () {
                return PostFilters.hasFilters($scope.filters);
            };

            $scope.saveSearch = function () {
                // Copy the current filters into our search..
                $scope.savedSearch.filter = $scope.filters;
                // @TODO Prevent the user from creating one if they somehow manage to get to this point without being logged in
                $scope.savedSearch.user_id = $rootScope.currentUser ? $rootScope.currentUser.userId : null;
                ModalService.openTemplate('<saved-search-editor saved-search="savedSearch"></saved-search-editor>', 'set.create_savedsearch', 'star', $scope, false, false);
            };

            $scope.clearFilters = function () {
                PostFilters.clearFilters();
            };
        }
    };
}];
