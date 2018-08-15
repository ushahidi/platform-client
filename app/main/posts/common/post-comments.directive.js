module.exports = [
    '$rootScope',
    '$translate',
    'ContactEndpoint',
    'CommentEndpoint',
    'Notify',
    'UserEndpoint',
    '_',
    'moment',
    'ModalService',
function (
    $rootScope,
    $translate,
    ContactEndpoint,
    CommentEndpoint,
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
        template: require('./post-comment.html'),
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
            $scope.pageChanged = getCommentForPagination;
            $scope.showPagination = false;
            $scope.getContactDisplay = getContactDisplay;

            function activate() {
                // Can't activate if we don't have a contact
                if (!$scope.post.contact || !$scope.post.contact.id) {
                    return;
                }

                $scope.comments = []; // init to blank
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

                getCommentsForPagination();
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

            function getCommentsForPagination() {

                if ($scope.post.contact.id) {
                    CommentEndpoint.allInThread({
                        contact: $scope.post.contact.id,
                        offset: ($scope.currentPage - 1) * $scope.itemsPerPage,
                        limit: $scope.itemsPerPage
                    }).$promise.then(function (response) {

                        var created,
                            comments = response.results;

                        $scope.comments = comments;
                        _.each(comments, function (message, index) {
                            if (comments.user) {
                                comments.user = UserEndpoint.get({id: comments.user.id});
                            }

                            // Format update time for display
                            created = comments.updated || comments.created;
                            comments.displayTime = formatDate(created);
                        });

                        $scope.totalItems = response.total_count;
                        $scope.showPagination = $scope.totalItems > 0  ? $scope.totalItems / $scope.itemsPerPage > 1 : false;

                    });
                }
            }

            $scope.saveComment = function () {
                ModalService.close();

                var reply = {
                    comments: $scope.comments.reply_text,
                    direction: 'outgoing',
                    contact_id: $scope.post.contact.id,
                    parent_id: $scope.comments[$scope.comments.length - 1].id
                };

                var request = MessageEndpoint.save(reply);

                request.$promise.then(function (response) {
                    // Update listing with new comments
                    getCommentsForPagination();

                    Notify.notify('notify.comments.sent_to', {contact: $scope.contact.contact});
                }, function (errorResponse) {
                    Notify.apiErrors(errorResponse);
                });
            };

            $scope.reply = function () {
                $scope.message = {};
                ModalService.openTemplate(require('./post-comments-reply.html'), 'post.comments.send', false, $scope, true, true);
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
