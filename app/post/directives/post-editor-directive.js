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
        'TagEndpoint',
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
            TagEndpoint,
            FormEndpoint,
            FormStageEndpoint,
            FormAttributeEndpoint,
            Notify,
            _
        ) {

            TagEndpoint.query().$promise.then(function (results) {
                $scope.categories = results;
            });
            $scope.everyone = $filter('translate')('post.modify.everyone');
            $scope.isEdit = !!$scope.post.id;
            $scope.validationErrors = [];

            $scope.goBack = function () {
                $scope.post.form = null;
            };

            $scope.allowedChangeStatus = function () {
                return $scope.post.allowed_privileges && $scope.post.allowed_privileges.indexOf('change_status') !== -1;
            };

            $scope.setDraft = function () {
                $scope.post.status = 'draft';
            };

            $scope.setVisibleStage = function (stageId) {
                $scope.visibleStage = stageId;
            };

            $scope.isFirstStage = function (stageId) {

                if (!_.isEmpty($scope.stages)) {
                    return stageId === $scope.stages[0].id;
                }
                return false;

            };

            $scope.isStageValid = function (stageId) {

                if ($scope.isFirstStage(stageId)) {

                    // The first stage is assumed to contain the title, content, and the tags
                    //  - these are not stored in attributes and do not have a 'required' field
                    //   thus, if any of these are invalid, the first stage is not ready to complete

                    // Return if form isn't initialized yet
                    if (!$scope.form) {
                        return false;
                    }

                    if ($scope.form.title.$invalid || $scope.form.content.$invalid) {
                        return false;
                    }

                    if ($scope.form.tags && $scope.form.tags.$invalid) {
                        return false;
                    }
                }
                // now checking all other post attributes that are required
                return _.chain($scope.attributes)
                .where({form_stage_id : stageId, required: true})
                .reduce(function (isValid, attr) {
                    // checkbox validity needs to be handled differently
                    // because it has multiple inputs identified via the options
                    if (attr.input === 'checkbox') {
                        var checkboxValidity = false;
                        _.each(attr.options, function (option) {
                            if (!_.isUndefined($scope.form['values_' + attr.key + '_' + option]) && !$scope.form['values_' + attr.key + '_' + option].$invalid) {
                                checkboxValidity = isValid;
                            }
                        });
                        return checkboxValidity;
                    } else {
                        if (_.isUndefined($scope.form['values_' + attr.key]) || $scope.form['values_' + attr.key].$invalid) {
                            return false;
                        }
                        return isValid;
                    }
                }, true)
                .value();
            };

            $scope.stageIsComplete = function (stageId) {
                return _.includes($scope.post.completed_stages, stageId);
            };

            $scope.toggleStageCompletion = function (stageId) {

                stageId = parseInt(stageId);
                if (_.includes($scope.post.completed_stages, stageId)) {
                    $scope.post.completed_stages = _.without($scope.post.completed_stages, stageId);

                } else if ($scope.isStageValid(stageId)) {
                    $scope.post.completed_stages.push(stageId);
                }
            };

            $scope.publishPostTo = function (updatedPost) {

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
                $scope.post = updatedPost;

                if (!$scope.post.id) {
                    // We're in the create interface and we should
                    // return having set the publised_to field of the post
                    return;
                }

                PostEndpoint.update($scope.post)
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
            };

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

            $scope.isDate = function (attr) {
                return attr.input === 'date';
            };
            $scope.isDateTime = function (attr) {
                return attr.input === 'datetime';
            };
            $scope.isLocation = function (attr) {
                return attr.input === 'location';
            };
            $scope.isSelect = function (attr) {
                return attr.input === 'select';
            };
            $scope.isNumber = function (attr) {
                return attr.input === 'number';
            };
            $scope.isText = function (attr) {
                return attr.input === 'text';
            };
            $scope.isTextarea = function (attr) {
                return attr.input === 'textarea';
            };
            $scope.isCheckbox = function (attr) {
                return attr.input === 'checkbox';
            };
            $scope.isRadio = function (attr) {
                return attr.input === 'radio';
            };
            $scope.isRelation = function (attr) {
                return attr.input === 'relation';
            };
            // Can more values be added for this attribute?
            $scope.canAddValue = function (attr) {
                return (
                    // Attribute allows unlimited values
                    attr.cardinality === 0 ||
                    // Less values than cardinality allows
                    $scope.post.values[attr.key].length < attr.cardinality
                );
            };
            // Can this values be removed?
            $scope.canRemoveValue = function (attr, key) {
                return $scope.post.values[attr.key].length > 1;
            };
            // Add a new value
            $scope.addValue = function (attr) {
                $scope.post.values[attr.key].push(null);
            };
            // Remove a value
            $scope.removeValue = function (attr, key) {
                $scope.post.values[attr.key].splice(key, 1);
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
