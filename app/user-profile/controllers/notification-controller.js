module.exports = [
    '$scope',
    '$translate',
    '$q',
    '$route',
    '$location',
    '_',
    'UserEndpoint',
    'ContactEndpoint',
    'CollectionEndpoint',
    'SavedSearchEndpoint',
    'NotificationEndpoint',
    'Notify',
    function (
        $scope,
        $translate,
        $q,
        $route,
        $location,
        _,
        UserEndpoint,
        ContactEndpoint,
        CollectionEndpoint,
        SavedSearchEndpoint,
        NotificationEndpoint,
        Notify
) {
        $translate('notification.title').then(function (title) {
            $scope.$emit('setPageTitle', title);
        });

        var showErrorMessage = function (errorMessage) {
            $translate(errorMessage)
                .then(function (message) {
                    Notify.showSingleAlert(message);
                });
        };

        var loadNotifications = function () {
            NotificationEndpoint.get(function (notifications) {
                _.forEach(notifications, function (notification) {
                    // Add name of the subscribed collection
                    CollectionEndpoint.get({collectionId: notification.set.id}, function (collection) {
                        notification.name = collection.name;
                    }, function () {
                        // Try to get the SavedSearch name instead
                        SavedSearchEndpoint.get({id: notification.set.id}, function (savedSearch) {
                            notification.name = savedSearch.name;
                        });
                    });

                    // @todo Probably use something else here instead of toggling.
                    // Available notifications are checked by default
                    notification.checked = true;
                });

                $scope.notifications = notifications;
            });
        };

        loadNotifications();

        $scope.deleteNotification = function (notification) {
            $translate('notify.notification.delete_confirm').then(function (message) {
                Notify.showConfirm(message).then(function () {
                    notification.$delete({id: notification.id}, function () {
                        // releod notificatons;
                        loadNotifications();
                    }, function () {
                        showErrorMessage('notification.error_message');
                    });
                }, function () {
                    // Toggle this back on after the user cancels
                    notification.checked = true;
                });
            });
        };

        var loadContacts = function () {
            ContactEndpoint.get(function (contacts) {
                _.forEach(contacts, function (contact) {
                    // Save the original contact value
                    // and use it to track changes
                    contact.original = contact.contact;
                });

                // Grab the user registration email if there are no contacts
                if (contacts.length === 0) {
                    UserEndpoint.get({id: 'me'}, function (user) {
                        contacts.push({
                            type: 'email',
                            contact: user.email,
                            original: user.email
                        });
                    });

                    // Cannot add additional contacts until the email address is added
                    $scope.canAddContact = false;
                } else {
                    $scope.canAddContact = true;
                }

                $scope.contacts = contacts;
            });
        };

        loadContacts();

        // Default contact type for new contacts
        $scope.contact = {
            type: 'email'
        };

        $scope.contactHasChanged = function (contact) {
            return contact.original !== contact.contact;
        };

        $scope.cancelContactEdit = function (contact) {
            // Restore original value
            contact.contact = contact.original;
        };

        $scope.saveContact = function (contact) {
            $scope.saving = true;

            if (contact.id) {
                contact.$update({id: contact.id}, function (contact) {
                    // update original value of contact
                    contact.original = contact.contact;
                }, function () {
                    showErrorMessage('contact.error_message');
                });

            } else {
                // Enable notifications for new contacts by default
                contact.can_notify = true;
                ContactEndpoint.save(contact, function () {
                    // Reset new contact field
                    $scope.contact = {
                        type: contact.type,
                        contact: ''
                    };
                    // Reload contacts
                    loadContacts();
                }, function () {
                    showErrorMessage('contact.error_message');
                });
            }

            $scope.saving = false;
        };
    }];
