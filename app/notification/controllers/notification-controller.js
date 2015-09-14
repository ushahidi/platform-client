module.exports = [
    '$scope',
    '$translate',
    '$q',
    '$route',
    '$location',
    '_',
    'notifications',
    'UserEndpoint',
    'ContactEndpoint',
    'CollectionEndpoint',
    'NotificationEndpoint',
    function (
        $scope,
        $translate,
        $q,
        $route,
        $location,
        _,
        notifications,
        UserEndpoint,
        ContactEndpoint,
        CollectionEndpoint,
        NotificationEndpoint
) {
        $translate('notification.title').then(function (title) {
            $scope.title = title;
            $scope.$emit('setPageTitle', title);
        });

        // Prepare new subscription for a collection
        $route.current.params.setId &&
            CollectionEndpoint.get({collectionId: $route.current.params.setId}, function (collection) {
                $scope.newNotification = {
                    set: collection.id,
                    name: collection.name
                };
            });

        var initializeNotification = function (notification) {
            CollectionEndpoint.get({collectionId: notification.set.id}, function (collection) {
                // Add name of the subscribed collection
                notification.collection = collection.name;
            });

            notification.checked = notification.is_subscribed === 1;

            return notification;
        };

        var loadNotifications = function () {
            _.forEach(notifications, function (notification) {
                initializeNotification(notification);
            });

            $scope.notifications = notifications;
        };

        loadNotifications();

        $scope.addNotification = function (notification) {
            NotificationEndpoint.addNotification(notification, function () {
                // Remove query params
                $location.url($location.path());
                // Refresh with updated notifications
                loadNotifications();
            });
        };

        $scope.updateNotification = function (notification) {
            $scope.notificationSaved = false;
            $scope.notificationError = false;

            notification.is_subscribed = notification.checked ? 1 : 0;
            notification.$update({id: notification.id}, function (notification) {
                initializeNotification(notification);
                $scope.notificationSaved = true;
            }, function () {
                $scope.notificationError = true;
            });
        };

        var initializeContact = function (contact) {
            // Add an edit option for each contact
            contact.edit = false;
            contact.checked = contact.can_notify === 1;
            // Save the original contact value
            // and use it to track changes
            contact.original = contact.contact;
        };

        var loadContacts = function () {
            var newContacts = [];

            ContactEndpoint.get(function (contacts) {
                _.forEach(contacts, function (contact) {
                    initializeContact(contact);
                });

                $scope.contacts = contacts;

                // Grab the user registration email if there are no contacts
                if (contacts.length === 0) {
                    UserEndpoint.get({id: 'me'}, function (user) {
                        newContacts.push({
                            type: 'email',
                            contact: user.email
                        });
                    });
                }

                // Give the user the opportunity to enter a phone number
                if (contacts.length === 1 && contacts[0].type !== 'phone') {
                    newContacts.push({
                        type: 'phone',
                        contact: ''
                    });
                }

                $scope.newContacts = newContacts;
            });
        };

        loadContacts();

        $scope.contactHasChanged = function (contact) {
            return contact.original !== contact.contact;
        };

        $scope.cancelContactEdit = function (contact) {
            contact.edit = false;
            // Restore original value
            contact.contact = contact.original;
        };

        $scope.updateContact = function (contact) {
            contact.saving = true;

            contact.$update({id: contact.id}, function (contact) {
                initializeContact(contact);
            });

            contact.saving = false;
        };

        $scope.addContact = function (contact) {
            contact.saving = true;
            // Save and refresh with updated contacts
            ContactEndpoint.addContact(contact, loadContacts);
        };

        // Save selections for contacts
        $scope.updateContacts = function () {
            $scope.saving = true;

            _.forEach($scope.contacts, function (contact) {
                contact.can_notify = contact.checked ? 1 : 0;
                contact.$update({id: contact.id}, function (contact) {
                    initializeContact(contact);
                });
            });

            $scope.saving = false;
        };
    }];
