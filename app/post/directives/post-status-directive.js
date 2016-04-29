module.exports = [
function (
) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            post: '=',
            stages: '='
        },
        templateUrl: 'templates/posts/post-status.html',
        controller: [
            '$scope',
            '$translate',
            '$filter',
            'PostEndpoint',
            'Notify',
            '_',
        function (
            $scope,
            $translate,
            $filter,
            PostEndpoint,
            Notify,
            _
        ) {
            $scope.allowedChangeStatus = function () {
                return $scope.post.allowed_privileges && $scope.post.allowed_privileges.indexOf('change_status') !== -1;
            };

            $scope.publishPostTo = function () {

                var post = angular.copy($scope.post);
                if (post.status === 'published') {
                    // first check if stages required have been marked complete
                    var requiredStages = _.where($scope.stages, {required: true}), errors = [];

                    _.each(requiredStages, function (stage) {
                        // if this stage isn't complete, add to errors
                        if (_.indexOf($scope.post.completed_stages, stage.id) === -1) {
                            errors.push($filter('translate')('post.modify.incomplete_step', { stage: stage.label }));
                        }
                    });

                    if (errors.length) {
                        Notify.showAlerts(errors);
                        return;
                    }

                    if (!$scope.post.id) {
                        // We're in the create interface and we should
                        // return having set the publised_to field of the post
                        return;
                    }

                    // Clean up post values object
                    _.each(post.values, function (value, key) {
                        // Strip out empty values
                        post.values[key] = _.filter(value);
                        // Remove entirely if no values are left
                        if (!post.values[key].length) {
                            delete post.values[key];
                        }
                    });

                    PostEndpoint.update(post)
                    .$promise
                    .then(function (post) {
                        var message = post.status === 'draft' ? 'notify.post.set_draft' : 'notify.post.publish_success';
                        var role = message === 'draft' ? 'draft' : (_.isEmpty(post.published_to) ? 'everyone' : post.published_to.join(', '));
                        $translate(message, {role: role})
                        .then(function (message) {
                            Notify.showNotificationSlider(message);
                        });
                    }, function (errorResponse) {
                        Notify.showApiErrors(errorResponse);
                    });
                }
            };
        }]
    };
}];
