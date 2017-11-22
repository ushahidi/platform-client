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

            $scope.save = function (savedSearch) {
                $scope.isSaving = true;
                var persist = savedSearch.id ? SavedSearchEndpoint.update : SavedSearchEndpoint.save;
                persist(savedSearch)
                .$promise
                .then(function (savedSearch) {
                    $location.url('/savedsearches/' + savedSearch.id);
                    $scope.savedSearch = _.clone(savedSearch);
                    $scope.$parent.closeModal();
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
