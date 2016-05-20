module.exports = PostCardDirective;

PostCardDirective.$inject = [
    '$translate',
    '$q',
    '$filter',
    '$rootScope',
    'PostEndpoint',
    'TagEndpoint',
    'UserEndpoint',
    'FormEndpoint',
    'FormStageEndpoint',
    'Notify',
    '_',
    'moment',
    '$location'
];
function PostCardDirective(
    $translate,
    $q,
    $filter,
    $rootScope,
    PostEndpoint,
    TagEndpoint,
    UserEndpoint,
    FormEndpoint,
    FormStageEndpoint,
    Notify,
    _,
    moment,
    $location
) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            post:  '=',
            canSelect: '=',
            selectedPosts: '='
        },
        templateUrl: 'templates/posts/card.html',
        link: function ($scope) {
            $scope.deletePost = deletePost;
            $scope.visibleTo = '';
            $scope.displayTime = '';
            $scope.displayTimeFull = '';

            activate();

            function activate() {
                $scope.visibleTo = visibleTo($scope.post);
                $scope.post.source = formatSource($scope.post.source);
                $scope.post.user = loadUser($scope.post.user);

                loadForm($scope.post.form);
                formatDates();
            }

            // Format source (fixme!)
            function formatSource(source) {
                if (source === 'sms') {
                    return 'SMS';
                } else if (source) {
                    // Uppercase first character
                    return source.charAt(0).toUpperCase() + source.slice(1);
                } else {
                    return 'Web';
                }
            }

            // Load the post author
            function loadUser(user) {
                if (user && user.id) {
                    return UserEndpoint.get({id: $scope.post.user.id});
                }
            }

            function loadForm(form) {
                // Replace form with full object
                if (form) {
                    FormEndpoint.get({id: form.id}, function (form) {
                        $scope.post.form = form;
                    });
                }
            }

            function formatDates() {
                var created = moment($scope.post.created),
                    now = moment();

                if (now.isSame(created, 'day')) {
                    $scope.displayTime = created.fromNow();
                } else if (now.isSame(created, 'week')) {
                    $scope.displayTime = created.format('LT');
                } else {
                    $scope.displayTime = created.format('LL');
                }
                $scope.displayTimeFull = created.format('LLL');
            }

            function visibleTo(post) {
                if (post.status === 'draft') {
                    return 'draft';
                }

                if (!_.isEmpty(post.published_to)) {
                    return post.published_to.join(', ');
                }

                return 'everyone';
            }

            // @todo move to shared service?
            function deletePost(post) {
                $translate('notify.post.destroy_confirm').then(function (message) {
                    Notify.showConfirmModal(message, false, 'Delete', 'delete').then(function () {
                        PostEndpoint.delete({ id: post.id }).$promise.then(function () {
                            $translate(
                                'notify.post.destroy_success',
                                {
                                    name: post.title
                                }
                            ).then(function (message) {
                                Notify.showNotificationSlider(message);
                            });
                        }, function (errorResponse) {
                            Notify.showApiErrors(errorResponse);
                        });
                    });
                });
            }
        }
    };
};

