module.exports = [
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
    '$location',
function (
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
    var visibleTo = function (post) {
        if (post.status === 'draft') {
            return 'draft';
        }

        if (!_.isEmpty(post.published_to)) {
            return post.published_to.join(', ');
        }

        return 'everyone';
    };

    // @todo move to shared service?
    var deletePost = function (post) {
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
    };

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
            $scope.visibleTo = visibleTo($scope.post);

            // Format source (fixme!)
            if ($scope.post.source === 'sms') {
                $scope.post.source = 'SMS';
            } else if ($scope.post.source) {
                // Uppercase first character
                $scope.post.source = $scope.post.source.charAt(0).toUpperCase() + $scope.post.source.slice(1);
            } else {
                $scope.post.source = 'Web';
            }

            // Load the post author
            if ($scope.post.user && $scope.post.user.id) {
                $scope.post.user = UserEndpoint.get({id: $scope.post.user.id});
            }

            // Ensure completes stages array is numeric
            $scope.post.completed_stages = $scope.post.completed_stages.map(function (stageId) {
                return parseInt(stageId);
            });

            // Replace tags with full tag object
            $scope.post.tags = $scope.post.tags.map(function (tag) {
                return TagEndpoint.get({id: tag.id, ignore403: true});
            });

            // Replace form with full object
            if ($scope.post.form) {
                FormEndpoint.get({id: $scope.post.form.id}, function (form) {
                    $scope.post.form = form;
                });
            }

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

            $scope.deletePost = deletePost;
        }
    };

}];
