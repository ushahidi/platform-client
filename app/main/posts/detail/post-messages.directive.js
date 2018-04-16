module.exports = [
    '$rootScope',
    '$translate',
    'ContactEndpoint',
    'MessageEndpoint',
    'Notify',
    'UserEndpoint',
    '_',
    'moment',
    'ModalService',
function (
    $rootScope,
    $translate,
    ContactEndpoint,
    MessageEndpoint,
    Notify,
    UserEndpoint,
    _,
    moment,
    ModalService
) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            post: '='
        },
        template: require('./post-messages.html'),
        link: function ($scope) {

            $scope.$watch('post.contact.id', function (contactId, oldContactId) {
                if (contactId !== oldContactId) {
                    activate();
                }
            });

            // Pagination
            $scope.currentPage = 1;
            $scope.itemsPerPage = 5;
            $scope.totalItems = $scope.itemsPerPage;
            $scope.pageChanged = getMessagesForPagination;
            $scope.showPagination = false;
            $scope.getContactDisplay = getContactDisplay;

            function activate() {
                // Can't activate if we don't have a contact
                if (!$scope.post.contact || !$scope.post.contact.id) {
                    return;
                }

                $scope.messages = []; // init to blank
                // Initialize
                if ($scope.post.contact && $scope.post.contact.contact) {
                    $scope.contact = $scope.post.contact;
                    // Set contact user is available
                    setContactUser($scope.contact);
                } else {
                    ContactEndpoint.get({ id: $scope.post.contact.id })
                        .$promise.then(function (contact) {
                            $scope.contact = contact;
                            // Set contact user is available
                            setContactUser($scope.contact);
                        });
                }

                getMessagesForPagination();
            }

            activate();

            function getContactDisplay() {
                if ($scope.contact.user && $scope.contact.user.realname) {
                    return $scope.contact.user.realname;
                }

                return $scope.contact.contact;
            }

            function setContactUser(contact) {
                if ($scope.contact.user) {
                    UserEndpoint.get({ id: $scope.contact.user.id })
                        .$promise.then(function (user) {
                            $scope.contact.user = user;
                        });
                }
            }

            function getMessagesForPagination() {

                if ($scope.post.contact.id) {
                    MessageEndpoint.allInThread({
                        post: $scope.post.id,
                        contact: $scope.post.contact.id,
                        offset: ($scope.currentPage - 1) * $scope.itemsPerPage,
                        limit: $scope.itemsPerPage
                    }).$promise.then(function (response) {

                        var created,
                            messages = response.results;

                        $scope.messages = messages;
                        _.each(messages, function (message, index) {
                            if (message.user) {
                                message.user = UserEndpoint.get({id: message.user.id});
                            }

                            // Format update time for display
                            created = message.updated || message.created;
                            message.displayTime = formatDate(created);
                        });

                        $scope.totalItems = response.total_count;
                        $scope.showPagination = $scope.totalItems > 0  ? $scope.totalItems / $scope.itemsPerPage > 1 : false;

                    });
                }
            }

            $scope.sendMessage = function () {
                ModalService.close();

                var reply = {
                    message: $scope.message.reply_text,
                    direction: 'outgoing',
                    contact_id: $scope.post.contact.id,
                    parent_id: $scope.messages[$scope.messages.length - 1].id
                };

                var request = MessageEndpoint.save(reply);

                request.$promise.then(function (response) {
                    // Update listing with new messages
                    getMessagesForPagination();

                    Notify.notify('notify.message.sent_to', {contact: $scope.contact.contact});
                }, function (errorResponse) {
                    Notify.apiErrors(errorResponse);
                });
            };

            $scope.reply = function () {
                $scope.message = {};
                ModalService.openTemplate(require('./post-messages-reply.html'), 'post.messages.send', false, $scope, true, true);
            };

            function formatDate(date) {
                var now = moment();
                date = moment(date);

                if (now.isSame(date, 'day')) {
                    return date.fromNow();
                }

                return date.format('LLL');
            }
        }
    };
}];
