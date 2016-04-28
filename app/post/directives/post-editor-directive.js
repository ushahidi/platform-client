module.exports = [
function (
) {
    var controller = [
        '$scope',
        '$filter',
        '$location',
        '$translate',
        'PostEntity',
        'PostEndpoint',
        'FormEndpoint',
        'FormStageEndpoint',
        'FormAttributeEndpoint',
        'Notify',
        '_',
        function (
            $scope,
            $filter,
            $location,
            $translate,
            postEntity,
            PostEndpoint,
            FormEndpoint,
            FormStageEndpoint,
            FormAttributeEndpoint,
            Notify,
            _
        ) {
            // Setup initial stages container

            $scope.everyone = $filter('translate')('post.modify.everyone');
            $scope.isEdit = !!$scope.post.id;
            $scope.validationErrors = [];
            $scope.visibleStage = 1;

            $scope.goBack = function () {
                $scope.post.form = null;
            };

            $scope.setVisibleStage = function (stageId) {
                $scope.visibleStage = stageId;
            };

            $scope.fetchAttributes = function (formId) {
                FormAttributeEndpoint.query({formId: formId}).$promise.then(function (attrs) {
                    // Initialize values on post (helps avoid madness in the template)
                    attrs.map(function (attr) {
                        if (!$scope.post.values[attr.key]) {
                            if (attr.input === 'location') {
                                $scope.post.values[attr.key] = [null];
                            } else if (attr.input === 'checkbox') {
                                $scope.post.values[attr.key] = [];
                            } else {
                                $scope.post.values[attr.key] = [attr.default];
                            }
                        }
                    });
                    $scope.attributes = attrs;
                });
            };

            $scope.fetchStages = function (formId) {
                FormStageEndpoint.query({ formId: formId }).$promise.then(function (stages) {
                    var post = $scope.post;
                    $scope.stages = stages;

                    // If number of completed stages matches number of stages,
                    // assume they're all complete, and just show the first stage
                    if (post.completed_stages.length === stages.length) {
                        $scope.setVisibleStage(stages[0].id);
                    } else {
                        // Get incomplete stages
                        var incompleteStages = _.filter(stages, function (stage) {
                            return !_.contains(post.completed_stages, stage.id);
                        });

                        // Return lowest priority incomplete stage
                        $scope.setVisibleStage(incompleteStages[0].id);
                    }
                });
            };

            $scope.fetchForm = function (formId) {
                FormEndpoint.get({id: formId}).$promise.then(function (form) {
                    $scope.post.form = form;
                    $scope.fetchAttributes(form.id);
                    $scope.fetchStages(form.id);
                });
            };

            if ($scope.post.form.id) {
                $scope.fetchForm($scope.post.form.id);
            }

            $scope.canSavePost = function () {
                var valid = true;
                if ($scope.post.status === 'published') {
                    // first check if stages required have been marked complete
                    var requiredStages = _.where($scope.stages, {required: true}) ;

                    valid = _.reduce(requiredStages, function (isValid, stage) {
                        // if this stage isn't complete, add to errors
                        if (_.indexOf($scope.post.completed_stages, stage.id) === -1) {
                            return false;
                        }

                        return isValid;
                    }, valid);

                    valid = _.reduce($scope.post.completed_stages, function (isValid, stageId) {
                        return $scope.isStageValid(stageId) && isValid;
                    }, valid);
                }

                return valid;
            };

            $scope.savePost = function () {
                if (!$scope.canSavePost()) {
                    return;
                }

                $scope.saving_post = true;

                // Avoid messing with original object
                var post = angular.copy($scope.post);

                // Clean up post values object
                _.each(post.values, function (value, key) {
                    // Strip out empty values
                    post.values[key] = _.filter(value);
                    // Remove entirely if no values are left
                    if (!post.values[key].length) {
                        delete post.values[key];
                    }
                });

                var request;
                if (post.id) {
                    request = PostEndpoint.update(post);
                } else {
                    request = PostEndpoint.save(post);
                }

                request.$promise.then(function (response) {
                    var success_message = $scope.allowedChangeStatus() ? 'notify.post.save_success' : 'notify.post.save_success_review';

                    if (response.id && response.allowed_privileges.indexOf('read') !== -1) {
                        $scope.saving_post = false;
                        $scope.post.id = response.id;
                        $translate(
                            success_message,
                            {
                                name: $scope.post.title
                            }).then(function (message) {
                            Notify.showNotificationSlider(message);
                            $location.path('/posts/' + response.id);
                        });
                    } else {
                        $translate(
                            success_message,
                            {
                                name: $scope.post.title
                            }).then(function (message) {
                                Notify.showNotificationSlider(message);
                                $location.path('/');
                            });
                    }
                }, function (errorResponse) { // errors
                    var validationErrors = [];
                    // @todo refactor limit handling
                    _.each(errorResponse.data.errors, function (value, key) {
                        // Ultimately this should check individual status codes
                        // for the moment just check for the message we expect
                        if (value.title === 'limit::posts') {
                            $translate('limit.post_limit_reached').then(function (message) {
                                Notify.showLimitSlider(message);
                            });
                        } else {
                            validationErrors.push(value);
                        }
                    });

                    Notify.showApiErrors(validationErrors);

                    $scope.saving_post = false;
                });
            };
        }];
    return {
        restrict: 'E',
        scope: {
            post: '=',
            activeForm: '='
        },
        templateUrl: 'templates/posts/post-editor.html',
        controller: controller
    };
}];
