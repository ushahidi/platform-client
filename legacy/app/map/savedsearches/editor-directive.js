module.exports = [
    '$q',
    '$filter',
    '$location',
    '$rootScope',
    '$translate',
    'SavedSearchEndpoint',
    '_',
    'Notify',
    'ViewHelper',
    'PostFilters',
function (
    $q,
    $filter,
    $location,
    $rootScope,
    $translate,
    SavedSearchEndpoint,
    _,
    Notify,
    ViewHelper,
    PostFilters
) {
    return {
        restrict: 'E',
        replace: true,
        template: require('./savedsearch-editor.html'),
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

            $scope.views = ViewHelper.views();

            $scope.cpySavedSearch = _.clone($scope.savedSearch);
            // translate the description and name if they have a translation available (ie the "My posts" search)
            $scope.cpySavedSearch.description = $filter('translate')($scope.cpySavedSearch.description);
            $scope.cpySavedSearch.name = $filter('translate')($scope.cpySavedSearch.name);
            $scope.save = function (savedSearch) {
                $scope.isSaving = true;
                var persist = savedSearch.id ? SavedSearchEndpoint.update : SavedSearchEndpoint.save;
                persist(savedSearch)
                .$promise
                .then(function (savedSearch) {
                    $scope.savedSearch = _.clone(savedSearch);
                    $scope.$parent.closeModal();
                    PostFilters.setMode('savedsearch', savedSearch);
                    $rootScope.$broadcast('savedSearch:update');
                    Notify.notify('notify.savedsearch.savedsearch_saved', {savedsearch: savedSearch.name});
                    $scope.isSaving = false;
                }, function (errorResponse) {
                    Notify.apiErrors(errorResponse);
                    $scope.isSaving = false;
                });
            };

            $scope.cancel = $scope.$parent.closeModal;
        }
    };
}];
