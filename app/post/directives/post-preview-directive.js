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
    _
) {
    var getCurrentStage = function (post) {
        var dfd = $q.defer();

        if (!post.form || !post.form.id) {
            // if there is no pre-defined structure in place (eg from SMS, stage is 'Structure'), and the
            // update link enables you to select a type of structure
            $translate('post.structure').then(dfd.resolve);
        } else {
            // Assume form is already loading/loaded
            FormStageEndpoint.query({formId: post.form.id}).$promise.then(function (stages) {
                // If number of completed stages matches number of stages, assume they're all complete
                if (post.completed_stages.length === stages.length) {
                    if (post.status === 'published') {
                        $translate('post.complete_published').then(dfd.resolve);
                    } else {
                        $translate('post.complete_draft').then(dfd.resolve);
                    }
                } else {
                    // Get incomplete stages
                    var incompleteStages = _.filter(stages, function (stage) {
                        return !_.contains(post.completed_stages, stage.id);
                    });

                    // Return lowest priority incomplete stage
                    dfd.resolve(incompleteStages[0].label);
                }
            });
        }

        return dfd.promise;
    };

    return {
        restrict: 'E',
        replace: true,
        scope: {
            post:  '=',
            canSelect: '='
        },
        templateUrl: 'templates/posts/preview.html',
        link: function ($scope) {

            $scope.publishedFor = function () {
                if ($scope.post.status === 'draft') {
                    return 'post.publish_for_you';
                }
                if (!_.isEmpty($scope.post.published_to)) {

                    return $scope.post.published_to;
                }

                return 'post.publish_for_everyone';
            };

            $scope.updateSelectedItems = function () {
                $rootScope.$broadcast('event:post:selection', $scope.post);
            };

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

            $scope.publishPostTo = function (updatePost) {

                // first check if stages required have been marked complete
                var requiredStages = _.where($scope.stages, {required: true}),
                    errors = [];

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

                $scope.post = updatePost;

                PostEndpoint.update($scope.post).
                $promise
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
            };

            // determine which stage the post is at
            getCurrentStage($scope.post).then(function (currentStage) {
                $scope.currentStage = currentStage;
            });
        }
    };

}];
