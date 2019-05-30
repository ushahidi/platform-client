module.exports = SavedSearchListEditorModal;

SavedSearchListEditorModal.$inject = [];
function SavedSearchListEditorModal() {
    return {
        restrict: 'E',
        scope: {
            searches: '='
        },
        controller: SavedSearchListEditorModalController,
        template: require('./saved-search-list-editor-modal.html')
    };
}

SavedSearchListEditorModalController.$inject = ['$scope', '$element', '$attrs', '$rootScope', '$location', '$q', 'Notify', 'UserEndpoint', 'SavedSearchEndpoint', '_', 'ModalService'];
function SavedSearchListEditorModalController($scope, $element, $attrs, $rootScope, $location, $q, Notify, UserEndpoint, SavedSearchEndpoint, _, ModalService) {
    $scope.selectedSavedSearches = [];
    $scope.processing = false;
    $scope.close = function () {
        ModalService.close();
    };
    $scope.delete = function () {
        if (!_.isEmpty($scope.selectedSavedSearches)) {
            $scope.processing = true;
            var deleteList = _.map($scope.selectedSavedSearches, function (itm) {
                return SavedSearchEndpoint.delete({
                    id: itm
                }).$promise;
            });
            $q.all (deleteList).then(function (results) {
                $rootScope.$broadcast('savedSearch:update');
                _.forEach($scope.selectedSavedSearches, function (itmId) {
                    delete $scope.searches[itmId];
                });
                if (deleteList.length > 1) {
                    Notify.notify('notify.savedsearch.delete_savedsearch_plural_success');
                } else {
                    Notify.notify('notify.savedsearch.delete_savedsearch_success');
                }
                cancelLoading();
            }, function (err) {
                Notify.apiErrors(err);
                cancelLoading();
            });
            var cancelLoading = function () {
                $scope.processing = false;
                ModalService.close();
            };
        }
    };
}
