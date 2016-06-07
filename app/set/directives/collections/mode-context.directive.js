module.exports = CollectionModeContext;

CollectionModeContext.$inject = [];

function CollectionModeContext() {
    return {
        restrict: 'E',
        controller: CollectionModeContextController,
        templateUrl: 'templates/sets/collections/mode-context.html'
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
    '_'
];
function CollectionModeContextController(
    $scope,
    $rootScope,
    $translate,
    $location,
    NotificationEndpoint,
    CollectionEndpoint,
    Notify,
    _
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
        });
    }

    function canEdit(collection) {
        return _.contains(collection.allowed_privileges, 'update');
    }

    function editCollection() {
        $rootScope.$emit('collectionEditor:show', $scope.collection);
    }

    function deleteCollection() {
        $translate('notify.collection.delete_collection_confirm')
            .then(function (message) {
                Notify.showConfirm(message).then(function () {
                    CollectionEndpoint.delete({
                        collectionId: $scope.collection.id
                    }).$promise.then(function () {
                        $location.url('/');
                        $rootScope.$broadcast('collection:update');
                    }, function (errorResponse) {
                        Notify.showApiErrors(errorResponse);
                    });
                });
            });
    }

    function saveNotification(collection) {
        var notification = {set: collection.id};
        NotificationEndpoint.save(notification).$promise.then(function (notification) {
            // No need to show the link after subscription
            $scope.showNotificationLink = false;
            $scope.notification = notification;
            $translate('notify.notification.add', {set: collection.name}).then(function (message) {
                Notify.showNotificationSlider(message);
            });
        });
    }

    function removeNotification() {
        $translate('notify.notification.delete_confirm')
        .then(function (message) {
            Notify.showConfirm(message).then(function () {
                NotificationEndpoint.delete($scope.notification).$promise.then(function (notification) {
                    $scope.showNotificationLink = true;
                    $translate('notify.notification.destroy_notification_success', {name: notification.name})
                    .then(function (message) {
                        Notify.showNotificationSlider(message);
                    });
                });
            });
        });
    }
}
