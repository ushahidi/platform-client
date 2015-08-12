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
        restrict: 'E',
        replace: true,
        scope: {
            formId: '@',
            formTemplate: '@'
        },
        templateUrl: 'templates/partials/form-editor.html',
        link: function ($scope, $element, $attrs) {
            // If we're editing an existing form,
            // load the form info and all the fields.
            $q.all([
                FormEndpoint.get({ id: $attrs.formId }).$promise,
                FormStageEndpoint.query({ formId: $attrs.formId }).$promise
            ]).then(function (results) {
                var form = results[0];
                form.stages = _.sortBy(results[1], 'priority');
                $scope.form = form;
            });

            $scope.isSettingsOpen = false;
            $scope.openSettings = function () {
                $scope.isSettingsOpen = !$scope.isSettingsOpen;
            };

            $scope.saveFormSettings = function (form) {
                FormEndpoint
                .update(form)
                .$promise
                .then(function () {
                    $scope.isSettingsOpen = false;
                }, function (errorResponse) {
                    var errors = _.pluck(errorResponse.data && errorResponse.data.errors, 'message');
                    errors && Notify.showAlerts(errors);
                });
            };

            $scope.deleteForm = function (stage) {
                $translate('notify.form.delete_form_confirm')
                .then(function (message) {
                    if (Notify.showConfirm(message)) {
                        FormEndpoint.delete({
                            id: $scope.form.id
                        }).$promise.then(function () {
                            $location.url('/settings/forms');
                        });
                    }
                });
            };

            $scope.deleteStage = function (stage, $index) {
                $translate('notify.form.delete_stage_confirm')
                .then(function (message) {
                    if (Notify.showConfirm(message)) {
                        FormStageEndpoint.delete({
                            formId: $scope.form.id,
                            id: stage.id
                        }).$promise.then(function () {
                            // Remove stage from scope, binding should take care of the rest
                            $scope.form.stages.splice($index, 1);
                        });
                    }
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
                FormStageEndpoint.update(_.extend(stage, {
                    formId: $scope.form.id
                }));

                // Save adjacent stage
                FormStageEndpoint.update(_.extend(next, {
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
                .save(_.extend(stage, {
                    formId: $scope.form.id,
                    priority: lastPriority + 1
                }))
                .$promise
                .then(function (stage) {
                    $scope.isNewStageOpen = false;
                    $scope.newStage = {};
                    $location.url('/settings/forms/' + $scope.form.id + '/stages/' + stage.id);
                }, function (errorResponse) {
                    var errors = _.pluck(errorResponse.data && errorResponse.data.errors, 'message');
                    errors && Notify.showAlerts(errors);
                });
            };
            // End manage stage
        }
    };
}];
