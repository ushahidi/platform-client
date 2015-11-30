module.exports = [
    '$q',
    '$location',
    '$translate',
    'FormEndpoint',
    'FormStageEndpoint',
    'FormAttributeEndpoint',
    '_',
    'Notify',
function (
    $q,
    $location,
    $translate,
    FormEndpoint,
    FormStageEndpoint,
    FormAttributeEndpoint,
    _,
    Notify
) {
    return {
        restrict: 'A',
        link: function ($scope, $element, $attrs) {
            // If we're editing an existing form,
            // load the form info and all the fields.
            $q.all([
                FormEndpoint.get({ id: $scope.formId }).$promise,
                FormStageEndpoint.query({ formId: $scope.formId }).$promise,
                FormAttributeEndpoint.query({ formId: $scope.formId }).$promise
            ]).then(function (results) {
                var form = results[0],
                    firstStage = results[1][0].id;

                form.stages = _.sortBy(results[1], 'priority');
                form.attributes = _.chain(results[2])
                    .sortBy('priority')
                    .value();

                $scope.form = form;
                $scope.setVisibleStage(firstStage);
            });

            $scope.setVisibleStage = function (stageId) {
                $scope.visibleStage = stageId;
            };

            $scope.isSettingsOpen = false;
            $scope.openSettings = function () {
                $scope.isSettingsOpen = !$scope.isSettingsOpen;
            };

            $scope.saveFormSettings = function (form) {
                FormEndpoint
                .saveCache(form)
                .$promise
                .then(function () {
                    $translate('notify.form.edit_form_success', { name: form.name }).then(function (message) {
                        Notify.showNotificationSlider(message);
                    });

                    $scope.isSettingsOpen = false;
                }, function (errorResponse) {
                    Notify.showApiErrors(errorResponse);
                });
            };

            $scope.deleteForm = function (stage) {
                $translate('notify.form.delete_form_confirm')
                .then(function (message) {
                    Notify.showConfirm(message).then(function () {
                        FormEndpoint.delete({
                            id: $scope.form.id
                        }).$promise.then(function () {
                            $translate('notify.form.destroy_form_success', { name: $scope.form.name }).then(function (message) {
                                Notify.showNotificationSlider(message);
                            });
                            $location.url('/settings/forms');
                        });
                    });
                });
            };

            $scope.deleteStage = function (stage, $index) {
                $translate('notify.form.delete_stage_confirm')
                .then(function (message) {
                    Notify.showConfirm(message).then(function () {
                        FormStageEndpoint.delete({
                            formId: $scope.form.id,
                            id: stage.id
                        }).$promise.then(function () {
                            // Remove stage from scope, binding should take care of the rest
                            $translate('notify.form.destroy_stage_success', {name: stage.label}).then(function (message) {
                                Notify.showNotificationSlider(message);
                            });
                            $scope.form.stages.splice($index, 1);
                        });
                    });
                });
            };

            $scope.changePriority = function (stage, increment) {
                var stages = $scope.form.stages,
                    // Find our current stage
                    index = _.indexOf(stages, stage),
                    // Grab prev/next stage
                    next = stages[index + increment];

                // Check we're not at the end of the list
                if (_.isUndefined(next)) {
                    return;
                }

                // Swap priorities
                next.priority = stage.priority;
                stage.priority = stage.priority + increment;

                // Save stage
                FormStageEndpoint.saveCache(_.extend(stage, {
                    formId: $scope.form.id
                }));

                // Save adjacent stage
                FormStageEndpoint.saveCache(_.extend(next, {
                    formId: $scope.form.id
                }));

                // Resort stage list
                $scope.form.stages = _.sortBy(stages, 'priority');
            };

            // Manage stage settings
            $scope.isNewStageOpen = false;
            $scope.openNewStage = function () {
                $scope.newStage = {};
                $scope.isNewStageOpen = !$scope.isNewStageOpen;
            };
            $scope.saveNewStage = function (stage) {
                var lastPriority = $scope.form.stages.length ? _.last($scope.form.stages).priority : 0;

                FormStageEndpoint
                .saveCache(_.extend(stage, {
                    formId: $scope.form.id,
                    priority: lastPriority + 1
                }))
                .$promise
                .then(function (stage) {
                    $scope.isNewStageOpen = false;
                    $scope.newStage = {};
                    $translate('notify.form.save_stage_success', {name: stage.label}).then(function (message) {
                        Notify.showNotificationSlider(message);
                    });
                    $location.url('/settings/forms/' + $scope.form.id + '/stages/' + stage.id);
                }, function (errorResponse) {
                    Notify.showApiErrors(errorResponse);
                });
            };
            // End manage stage
        }
    };
}];
