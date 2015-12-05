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
                form.grouped_attributes = _.sortBy(form.attributes, 'form_stage_id');
                $scope.form = form;
                $scope.setVisibleStage(firstStage);
            });

            $scope.editIsOpen = {};

            $scope.refreshStages = function () {
                FormStageEndpoint
                .query({ formId: $scope.formId })
                .$promise
                .then(function (results) {
                    $scope.form.stages = _.sortBy(results, 'priority');
                });
            };

            $scope.setVisibleStage = function (stageId) {
                $scope.visibleStage = stageId;
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
                    $scope.refreshStages();
                }, function (errorResponse) {
                    Notify.showApiErrors(errorResponse);
                });
            };

            $scope.isNewAttributeOpen = false;
            var newAttrCount = 0;
            $scope.openNewAttribute = function () {
                $scope.isNewAttributeOpen = true;
            };
            $scope.addNewAttribute = function (type, input, label) {
                //have to copy as reverse() changes in place
                var cloneAttributes = _.clone($scope.form.attributes);
                var count = _.countBy($scope.form.attributes, function (attribute) {
                    return attribute.form_stage_id;
                });

                var lastPriority = count[$scope.visibleStage] ? _.find(cloneAttributes.reverse(), function (item) {
                    return item.form_stage_id === $scope.visibleStage;
                }).priority : 0;

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
                    form_stage_id: $scope.visibleStage
                };

                $scope.form.attributes.push(attribute);
                $scope.form.grouped_attributes = _.sortBy($scope.form.attributes, 'form_stage_id');

                var index = _.findLastIndex($scope.form.grouped_attributes, function (item, index) {
                    return item.form_stage_id === $scope.visibleStage;
                });
                $scope.editIsOpen[index] = true;
            };

            // Attribute Functions
            $scope.saveAttribute = function (attribute, $index) {
                var persist = FormAttributeEndpoint.saveCache;
                persist(_.extend(attribute, {
                    formId: $scope.form.id
                })).$promise.then(function (attributeUpdate) {
                    $scope.editIsOpen[$index] = false;
                    $scope.form.attributes[$index] = attributeUpdate;
                    FormStageEndpoint.invalidateCache();
                    $translate('notify.form.save_attribute_success', {name: attribute.label}).then(function (message) {
                        Notify.showNotificationSlider(message);
                    });

                }, function (errorResponse) {
                    Notify.showApiErrors(errorResponse);
                });
            };

            $scope.deleteAttribute = function (attribute) {

                $translate('notify.form.delete_attribute_confirm')
                .then(function (message) {
                    Notify.showConfirm(message).then(function () {
                        if (attribute.id) {
                            FormAttributeEndpoint.delete({
                                formId: $scope.form.id,
                                id: attribute.id
                            }).$promise.then(function () {
                                // Remove attribute from scope, binding should take care of the rest
                                var index = _.findIndex($scope.form.attributes, function (item) {
                                    return item.id === attribute.id;
                                });

                                $scope.form.attributes.splice(index, 1);
                                $scope.form.grouped_attributes = _.sortBy($scope.form.attributes, 'form_stage_id');

                                FormStageEndpoint.invalidateCache();

                                $translate('notify.form.destroy_attribute_success', {name: attribute.label}).then(function (message) {
                                    Notify.showNotificationSlider(message);
                                });
                            });
                        } else { // If this was a new attribute, just remove from scope
                            // Remove attribute from scope, binding should take care of the rest
                            var index = _.findIndex($scope.form.attributes, function (item) {
                                return item.label === attribute.label;
                            });
                            $scope.form.attributes.splice(index, 1);
                            $scope.form.grouped_attributes = _.sortBy($scope.form.attributes, 'form_stage_id');
                        }
                    });
                });
            };

            $scope.changeAttributePriority = function (attribute, increment) {

                var attributes = $scope.form.grouped_attributes,
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
                FormAttributeEndpoint.saveCache(_.extend(attribute, {
                    formId: $scope.form.id
                }));

                // Save adjacent attribute
                FormAttributeEndpoint.saveCache(_.extend(next, {
                    formId: $scope.form.id
                }));

                // Resort attribute list
                $scope.form.attributes = _.sortBy(attributes, 'priority');
                $scope.form.grouped_attributes = _.sortBy($scope.form.attributes, 'form_stage_id');
            };

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
