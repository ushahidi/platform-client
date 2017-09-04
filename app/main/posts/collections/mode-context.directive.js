module.exports = CollectionModeContext;

CollectionModeContext.$inject = [];

function CollectionModeContext() {
    return {
        restrict: 'E',
        controller: CollectionModeContextController,
        template: require('./mode-context.html')
    };
}

CollectionModeContextController.$inject = [
    '$scope',
    '$rootScope',
    '$translate',
    '$location',
    'NotificationEndpoint',
    'CollectionEndpoint',
    'Notify',
    '_',
    'CollectionsService'
];
function CollectionModeContextController(
    $scope,
    $rootScope,
    $translate,
    $location,
    NotificationEndpoint,
    CollectionEndpoint,
    Notify,
    _,
    CollectionsService
) {
    $scope.editCollection = editCollection;
    $scope.deleteCollection = deleteCollection;
    $scope.saveNotification = saveNotification;
    $scope.removeNotification = removeNotification;

    // Show Add Notification link
    $scope.showNotificationLink = true;
    $scope.canEdit = false;
    $scope.notification = false;

    activate();

    function activate() {
        $scope.canEdit = canEdit($scope.collection);

        NotificationEndpoint.query({set: $scope.collection.id, ignore403: true, user: 'me'}, function (notifications) {
            // show link if subscription does not exist
            $scope.showNotificationLink = notifications.length === 0;
            if (notifications.length) {
                $scope.notification = notifications[0];
            }
        }, angular.noop);
    }

    function canEdit(collection) {
        return _.contains(collection.allowed_privileges, 'update');
    }

    function editCollection() {
        CollectionsService.editCollection($scope.collection);
    }

    function deleteCollection() {
        CollectionsService.deleteCollection($scope.collection);
    }

    function saveNotification(collection) {
        var notification = {set: collection.id};
        NotificationEndpoint.save(notification).$promise.then(function (notification) {
            // No need to show the link after subscription
            $scope.showNotificationLink = false;
            $scope.notification = notification;
            Notify.notify('notify.notification.add', {set: collection.name});
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
