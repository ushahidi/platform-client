module.exports = SavedSearchModeContext;

SavedSearchModeContext.$inject = [];

function SavedSearchModeContext() {
    return {
        restrict: 'E',
        controller: SavedSearchModeContextController,
        templateUrl: 'templates/sets/savedsearches/mode-context.html'
    };
}

SavedSearchModeContextController.$inject = [
    '$scope',
    '$translate',
    '$location',
    '$rootScope',
    'NotificationEndpoint',
    'SavedSearchEndpoint',
    'Notify',
    '_',
    'ModalService'
];
function SavedSearchModeContextController(
    $scope,
    $translate,
    $location,
    $rootScope,
    NotificationEndpoint,
    SavedSearchEndpoint,
    Notify,
    _,
    ModalService
) {
    // Show Add Notification link
    $scope.showNotificationLink = true;
    $scope.canEdit = false;
    $scope.notification = false;

    $scope.saveNotification = saveNotification;
    $scope.removeNotification = removeNotification;
    $scope.editSavedSearch = editSavedSearch;
    $scope.deleteSavedSearch = deleteSavedSearch;

    activate();

    function activate() {
        $scope.canEdit = canEdit($scope.savedSearch);

        NotificationEndpoint.query({set: $scope.savedSearch.id, ignore403: true, user: 'me'}, function (notifications) {
            // show link if subscription does not exist
            $scope.showNotificationLink = notifications.length === 0;
            if (notifications.length) {
                $scope.notification = notifications[0];
            }
        });
    }

    // Check if we can edit
    function canEdit(savedSearch) {
        return _.contains(savedSearch.allowed_privileges, 'update');
    }

    function editSavedSearch() {
        ModalService.openTemplate('<saved-search-editor saved-search="savedSearch"></saved-search-editor>', 'set.edit_search_settings', 'star', $scope, false, false);
        //$rootScope.$emit('savedSearchEditor:show', $scope.collection);
    }

    function deleteSavedSearch() {
        Notify.confirm('notify.savedsearch.delete_savedsearch_confirm').then(function () {
            SavedSearchEndpoint.delete({
                id: $scope.savedSearch.id
            }).$promise.then(function () {
                $location.url('/');
                $rootScope.$broadcast('savedSearch:update');
            }, function (errorResponse) {
                Notify.apiErrors(errorResponse);
            });
        });
    }

    function saveNotification(savedSearch) {
        var notification = {set: savedSearch.id};

        NotificationEndpoint.save(notification).$promise.then(function (notification) {
            // No need to show the link after subscription
            $scope.showNotificationLink = false;
            $scope.notification = notification;
            Notify.notify('notify.notification.add', {set: savedSearch.name});
        });
    }

    function removeNotification() {
        Notify.confirm('notify.notification.delete_confirm').then(function () {
            NotificationEndpoint.delete($scope.notification).$promise.then(function (notification) {
                $scope.showNotificationLink = true;
                Notify.notify('notify.notification.destroy_notification_success', {name: notification.name});
            });
        });
    }
}
