module.exports = [
    'UserEndpoint',
    'ContactEndpoint',
    'CollectionEndpoint',
    'SavedSearchEndpoint',
    'NotificationEndpoint',
    'Notify',
    '_',
    '$translate',
    '$q',
    function (
        UserEndpoint,
        ContactEndpoint,
        CollectionEndpoint,
        SavedSearchEndpoint,
        NotificationEndpoint,
        Notify,
        _,
        $translate,
        $q
    ) {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            templateUrl: 'templates/users/notifications.html',
            link: function ($scope, elem) {

                var loadNotifications = function () {
                    NotificationEndpoint.query({user: 'me'}).$promise.then(function (notifications) {
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
                        });

                        $scope.notifications = notifications;
                    });
                };

                var loadContacts = function () {
                    ContactEndpoint.query({user: 'me'}).$promise.then(function (contacts) {
                        _.forEach(contacts, function (contact) {
                            // Save the original contact values
                            // and use them to track changes
                            contact.original = {
                                contact: contact.contact,
                                can_notify: contact.can_notify
                            };

                            // make inactive by default
                            contact.active = false;
                        });

                        // Grab the user registration email if there are no contacts
                        if (contacts.length === 0) {
                            UserEndpoint.get({id: 'me'}, function (user) {
                                contacts.push({
                                    type: 'email',
                                    contact: user.email,
                                    original: user.email,
                                    active: false,
                                    isLoginEmail: true
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

                var saveContact = function (contact) {
                    if (contact.id) {
                        return ContactEndpoint.update(contact).$promise;

                    } else {
                        // Enable notifications for new contacts by default
                        contact.can_notify = true;
                        return ContactEndpoint.save(contact).$promise;
                    }
                };

                var contactHasChanged = function (contact) {
                    return contact.original.contact !== contact.contact ||
                        contact.original.can_notify !== contact.can_notify;

                };

                loadContacts();
                loadNotifications();

                $scope.deleteNotification = function (notification) {
                    Notify.confirmDelete('notify.notification.delete_confirm').then(function () {
                        NotificationEndpoint.delete({id: notification.id}).$promise.then(function () {
                            Notify.notify('notify.notification.destroy_success', {name: notification.name});

                            // Reload notifications
                            loadNotifications();
                        }, function () {
                            Notify.error('notification.error_message');
                        });
                    });
                };

                $scope.deleteContact = function (contact) {
                    Notify.confirmDelete('notify.contact.delete_confirm').then(function () {
                        ContactEndpoint.delete({id: contact.id}).$promise.then(function () {
                            Notify.notify('notify.contact.destroy_success');

                            // Reload Contacts
                            loadContacts();
                        }, function () {
                            Notify.error('contact.error_message');
                        });
                    });
                };

                // Default contact type for new contacts
                $scope.contact = {
                    type: 'email',
                    active: false
                };

                // New contact listing is inactive by default
                $scope.active = false;

                $scope.toggleActive = function (contact) {
                    contact.active = !contact.active;
                };

                // Only enable Save if active contacts are valid
                $scope.canUpdate = function () {
                    // Get contacts that are currently being edited
                    var activeContacts = _.filter($scope.contacts, function (contact) {
                        return contact.active === true;
                    });

                    return !_.isEmpty(activeContacts) && _.every(activeContacts, function (contact) {
                        return contactHasChanged(contact) && !_.isUndefined(contact.contact);
                    });
                };

                $scope.canAdd = function () {
                    if ($scope.contact.active) {
                        return !_.isUndefined($scope.contact.contact);
                    }

                    // Check if you can add the login email address as a contact
                    return _.find($scope.contacts, function (contact) {
                        return !_.isUndefined(contact.contact) && contact.isLoginEmail;
                    });
                };

                $scope.saveContacts = function () {
                    var validContacts,
                        promises = [];

                    $scope.saving = true;

                    // Get Valid contacts
                    validContacts = _.filter($scope.contacts, function (contact) {
                        return !_.isUndefined(contact.contact);
                    });

                    // Add new contact if valid
                    if (!_.isUndefined($scope.contact.contact)) {
                        validContacts.push($scope.contact);
                    }

                    _.forEach(validContacts, function (contact) {
                        promises.push(saveContact(contact));
                    });

                    $q.all(promises).then(function () {
                        Notify.notify('notify.contact.save_success');

                        $scope.$emit('event:close');
                    }, function () {
                        Notify.error('contact.error_message');
                    });

                    $scope.saving = false;
                };

                $scope.cancel = function () {
                    $scope.$emit('event:close');
                };
            }
        };
    }];
