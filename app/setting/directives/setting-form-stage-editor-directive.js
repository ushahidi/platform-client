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
            formTemplate: '@',
            stageId: '@'
        },
        templateUrl: 'templates/partials/form-stage-editor.html',
        link: function ($scope, $element, $attrs) {
            var stageId = $attrs.stageId;

            $scope.editIsOpen = {};

            // If we're editing an existing form,
            // load the form info and all the fields.
            $q.all([
                FormEndpoint.get({ id: $attrs.formId }).$promise,
                FormStageEndpoint.query({ formId: $attrs.formId }).$promise,
                FormAttributeEndpoint.query({ formId: $attrs.formId }).$promise
            ]).then(function (results) {
                var form = results[0],
                    firstStage = results[1][0].id,
                    currentStageId = parseInt(stageId ? stageId : firstStage);

                form.stages = _.indexBy(results[1], 'id');
                form.attributes = _.chain(results[2])
                    .where({ form_stage_id : currentStageId })
                    .sortBy('priority')
                    .value();

                $scope.form = form;
                $scope.currentStageId = currentStageId;
            });

            // Load available forms for relation fields
            $scope.availableForms = FormEndpoint.query();
            $scope.filterNotCurrentForm = function (form) {
                return form.id !== $attrs.formId;
            };

            // Manage stage settings
            $scope.isSettingsOpen = false;
            $scope.openSettings = function () {
                $scope.isSettingsOpen = !$scope.isSettingsOpen;
            };
            $scope.saveStageSettings = function (stage) {
                FormStageEndpoint
                .update(_.extend(stage, {
                    formId: $scope.form.id
                }))
                .$promise
                .then(function () {
                    $scope.isSettingsOpen = false;
                }, function (errorResponse) {
                    var errors = _.pluck(errorResponse.data && errorResponse.data.errors, 'message');
                    errors && Notify.showAlerts(errors);
                });
            };
            // End manage stage

            // Manage stage settings
            $scope.isNewStageOpen = false;
            $scope.openNewStage = function () {
                $scope.newStage = {};
                $scope.isNewStageOpen = !$scope.isNewStageOpen;
            };
            $scope.saveNewStage = function (stage) {
                FormStageEndpoint
                .save(_.extend(stage, {
                    formId: $scope.form.id
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

            // Add new attribute
            $scope.availableAttrTypes = [
                {
                    label: 'Short text',
                    type: 'varchar',
                    input: 'text'
                },
                {
                    label: 'Long text',
                    type: 'text',
                    input: 'textarea'
                },
                {
                    label: 'Number (Decimal)',
                    type: 'decimal',
                    input: 'number'
                },
                {
                    label: 'Number (Integer)',
                    type: 'int',
                    input: 'number'
                },
                {
                    label: 'Location',
                    type: 'point',
                    input: 'location'
                },
                // {
                //     label: 'Geometry',
                //     type: 'geometry',
                //     input: 'text'
                // },
                {
                    label: 'Date',
                    type: 'datetime',
                    input: 'date'
                },
                {
                    label: 'Date & time',
                    type: 'datetime',
                    input: 'datetime'
                },
                // {
                //     label: 'Time',
                //     type: 'datetime',
                //     input: 'time'
                // },
                {
                    label: 'Select',
                    type: 'varchar',
                    input: 'select'
                },
                {
                    label: 'Radio',
                    type: 'varchar',
                    input: 'radio'
                },
                {
                    label: 'Checkbox',
                    type: 'varchar',
                    input: 'checkbox'
                },
                {
                    label: 'Related Post',
                    type: 'relation',
                    input: 'relation'
                }
            ];
            $scope.isNewAttributeOpen = false;
            var newAttrCount = 0;
            $scope.openNewAttribute = function () {
                $scope.isNewAttributeOpen = true;
            };
            $scope.addNewAttribute = function (type, input, label) {
                var lastPriority = $scope.form.attributes.length ? _.last($scope.form.attributes).priority : 0;

                newAttrCount++;
                $scope.isNewAttributeOpen = false;
                var attribute = {
                    type: type,
                    input: input,
                    label: 'New ' + label.toLowerCase() + ' field',
                    required: false,
                    options: [],
                    config: {},
                    priority: lastPriority + 1,
                    form_stage_id: $scope.currentStageId
                };

                $scope.form.attributes.push(attribute);
                $scope.editIsOpen[$scope.form.attributes.length - 1] = true;
            };
            // End add new attribute

            // Attribute Functions
            $scope.saveAttribute = function (attribute, $index) {
                var persist = attribute.id ? FormAttributeEndpoint.update : FormAttributeEndpoint.save;
                persist(_.extend(attribute, {
                    formId: $scope.form.id
                })).$promise.then(function (attributeUpdate) {
                    $scope.editIsOpen[$index] = false;
                    $scope.form.attributes[$index] = attributeUpdate;
                }, function (errorResponse) {
                    var errors = _.pluck(errorResponse.data && errorResponse.data.errors, 'message');
                    errors && Notify.showAlerts(errors);
                });
            };

            $scope.deleteAttribute = function (attribute, $index) {

                $translate('notify.form.delete_attribute_confirm')
                .then(function (message) {
                    if (Notify.showConfirm(message)) {
                        if (attribute.id) {
                            FormAttributeEndpoint.delete({
                                formId: $scope.form.id,
                                id: attribute.id
                            }).$promise.then(function () {
                                // Remove attribute from scope, binding should take care of the rest
                                $scope.form.attributes.splice($index, 1);
                            });
                        } else { // If this was a new attribute, just remove from scope
                            // Remove attribute from scope, binding should take care of the rest
                            $scope.form.attributes.splice($index, 1);
                        }
                    }
                });
            };

            $scope.changePriority = function (attribute, increment) {
                var attributes = $scope.form.attributes,
                    // Find our current stage
                    index = _.indexOf(attributes, attribute),
                    // Grab prev/next stage
                    next = attributes[index + increment];

                // Check we're not at the end of the list
                if (_.isUndefined(next)) {
                    return;
                }

                // Swap priorities
                next.priority = attribute.priority;
                attribute.priority = attribute.priority + increment;

                // Save attribute
                FormAttributeEndpoint.update(_.extend(attribute, {
                    formId: $scope.form.id
                }));

                // Save adjacent attribute
                FormAttributeEndpoint.update(_.extend(next, {
                    formId: $scope.form.id
                }));

                // Resort attribute list
                $scope.form.attributes = _.sortBy(attributes, 'priority');
            };

            // Options functions
            $scope.hasOptions = function (attribute) {
                return _.contains(['checkbox', 'radio', 'select'], attribute.input);
            };
            $scope.removeOption = function (attribute, key) {
                attribute.options.splice(key, 1);
            };
            $scope.addOption = function (attribute) {
                attribute.options.push('');
            };

            // Update key based on label
            $scope.labelChanged = function (attribute) {
                if (!attribute.id) {
                    attribute.key = attribute.label.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-_]+/g, '').toLowerCase();
                }
            };
        }
    };
}];
