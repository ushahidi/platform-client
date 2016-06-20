module.exports = [
    '$q',
    '$location',
    '$rootScope',
    '$translate',
    'SavedSearchEndpoint',
    '_',
    'Notify',
    'ViewHelper',
    'RoleEndpoint',
function (
    $q,
    $location,
    $rootScope,
    $translate,
    SavedSearchEndpoint,
    _,
    Notify,
    ViewHelper,
    RoleEndpoint
) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'templates/sets/savedsearches/savedsearch-editor.html',
        scope: {
            savedSearch: '='
        },
        link: function ($scope, $element, $attrs) {
            if (!$scope.savedSearch) {
                throw {
                    message: 'savedsearchEditor must be passed a saved-search parameter'
                };
            }

            $scope.featuredEnabled = function () {
                return $rootScope.hasPermission('Manage Posts');
            };

            $scope.isAdmin = $rootScope.isAdmin;

            RoleEndpoint.query().$promise.then(function (roles) {
                $scope.roles = roles;
            });

            $scope.views = ViewHelper.views();

            $scope.cpySavedSearch = _.clone($scope.savedSearch);

            $scope.save = function (savedSearch) {
                var persist = savedSearch.id ? SavedSearchEndpoint.update : SavedSearchEndpoint.save;

                // Strip out any null values from visible_to
                savedSearch.visible_to = _.without(_.values(savedSearch.visible_to), null);

                persist(savedSearch)
                .$promise
                .then(function (savedSearch) {
                    $location.url('/savedsearches/' + savedSearch.id);
                    $scope.savedSearch = _.clone(savedSearch);
                    $scope.$parent.closeModal();
                    $rootScope.$broadcast('event:savedSearch:update');
                }, function (errorResponse) {
                    Notify.apiErrors(errorResponse);
                });
            };

            $scope.cancel = $scope.$parent.closeModal;
        }
    };
}];
