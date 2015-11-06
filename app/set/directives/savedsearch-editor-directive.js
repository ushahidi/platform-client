module.exports = [
    '$q',
    '$location',
    '$rootScope',
    '$translate',
    'SavedSearchEndpoint',
    '_',
    'Notify',
    'PostViewHelper',
    'RoleHelper',
function (
    $q,
    $location,
    $rootScope,
    $translate,
    SavedSearchEndpoint,
    _,
    Notify,
    PostViewHelper,
    RoleHelper
) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'templates/sets/savedsearch-editor.html',
        scope: {
            savedSearch: '=',
            isOpen: '='
        },
        link: function ($scope, $element, $attrs) {
            if (!$scope.savedSearch) {
                throw {
                    message: 'savedsearchEditor must be passed a saved-search parameter'
                };
            }

            $scope.isAdmin = $rootScope.isAdmin;

            $scope.roles = RoleHelper.roles();
            $scope.views = PostViewHelper.views();

            $scope.cpySavedSearch = _.clone($scope.savedSearch);

            $scope.$watch(function () {
                return $scope.isOpen.data;
            }, function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.cpySavedSearch = _.clone($scope.savedSearch);
                }
            });

            $scope.saveSavedsearch = function (savedSearch) {
                var persist = savedSearch.id ? SavedSearchEndpoint.update : SavedSearchEndpoint.save;

                // Strip out any null values from visible_to
                savedSearch.visible_to = _.without(_.values(savedSearch.visible_to), null);

                persist(savedSearch)
                .$promise
                .then(function (savedSearch) {
                    $location.url('/savedsearches/' + savedSearch.id);
                    $scope.savedSearch = _.clone(savedSearch);
                    $scope.isOpen.data = false;
                    $rootScope.$broadcast('event:savedSearch:update');
                }, function (errorResponse) {
                    Notify.showApiErrors(errorResponse);
                });
            };

            $scope.deleteSavedSearch = function () {
                $translate('notify.savedsearch.delete_savedsearch_confirm')
                .then(function (message) {
                    Notify.showConfirm(message).then(function () {
                        SavedSearchEndpoint.delete({ id: $scope.savedSearch.id }).$promise.then(function () {
                            $location.url('/');
                            $rootScope.$broadcast('event:savedSearch:update');
                        }, function (errorResponse) {
                            Notify.showApiErrors(errorResponse);
                        });
                    });
                });
            };
        }
    };
}];
