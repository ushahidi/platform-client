module.exports = SurveyEditor;

SurveyEditor.$inject = [];
function SurveyEditor() {
    return {
        restrict: 'E',
        scope: {
            surveyId: '='
        },
        controller: SurveyEditorController,
        templateUrl: 'templates/settings/surveys/modify/editor.html'
    };
}

SurveyEditorController.$inject = [
    '$scope',
    '$q',
    '$location',
    '$translate',
    'FormEndpoint',
    'FormStageEndpoint',
    'FormAttributeEndpoint',
    'RoleEndpoint',
    '_',
    'Notify'
];
function SurveyEditorController(
    $scope,
    $q,
    $location,
    $translate,
    FormEndpoint,
    FormStageEndpoint,
    FormAttributeEndpoint,
    RoleEndpoint,
    _,
    Notify
) {

    $scope.canReorderTask = canReorderTask;
    $scope.moveTaskUp = moveTaskUp;
    $scope.moveTaskDown = moveTaskDown;
    $scope.isFirstTask = isFirstTask;
    $scope.isLastTask = isLastTask;

    $scope.deleteTask = deleteTask;
    //$scope.addTask = addTask;

    $scope.deleteSurvey = deleteSurvey;
    $scope.saveSurvey = saveSurvey;
    $scope.cancel = cancel;

    activate();

    function activate() {
        RoleEndpoint.query().$promise.then(function (roles) {
            $scope.roles = roles;
        });
        if ($scope.surveyId) {
            loadFormData();
        } else {
            // When creating new survey
            // pre-fill object with default tasks and attributes
          /*  $scope.survey = {
                tasks: {
                    label: 'Post'
                },
                attributes
            }; */
        }

    }

    function loadFormData() {
        // If we're editing an existing survey,
        // load the survey info and all the fields.
        $q.all([
            FormEndpoint.get({ id: $scope.surveyId }).$promise,
            FormStageEndpoint.query({ formId: $scope.surveyId }).$promise,
            FormAttributeEndpoint.query({ formId: $scope.surveyId }).$promise
        ]).then(function (results) {
            var survey = results[0];
            survey.tasks = _.sortBy(results[1], 'priority');
            survey.attributes = _.chain(results[2])
                .sortBy('priority')
                .value();
            survey.grouped_attributes = _.sortBy(survey.attributes, 'form_stage_id');
            $scope.survey = survey;
        });
    }

    function cancel() {
        $location.url('/settings/surveys');
    }

    // START -- Reorder tasks
    function isFirstTask(task) {
        var tasks = $scope.survey.tasks,
            // Find our current stage
            index = _.indexOf(tasks, task);
        return index === 0;
    }

    function isLastTask(task) {
        var tasks = $scope.survey.tasks,
            // Find our current stage
            index = _.indexOf(tasks, task);
        return index === tasks.length-1;
    }

    function canReorderTask(task) {
        //Only the Post task can not be reordered
        return task.name !== 'Post';
    }

    function moveTaskUp(task) {
        changePriority(task, -1);
    }

    function moveTaskDown(task) {
        changePriority(task, 1);
    }

    function changePriority(task, increment) {
        var tasks = $scope.survey.tasks,
            // Find our current stage
            index = _.indexOf(tasks, task),
            // Grab prev/next stage
            next = tasks[index + increment];

        // Check we're not at the end of the list
        if (_.isUndefined(next)) {
            return;
        }
        // Swap priorities
        next.priority = task.priority;
        task.priority = task.priority + increment;

        // Resort stage list
        $scope.survey.tasks = _.sortBy(tasks, 'priority');
    }
    // END - reorder tasks

    // Start Modify Tasks
    function deleteTask(task) {
        $translate('notify.form.delete_stage_confirm')
        .then(function (message) {
            Notify.showConfirm(message).then(function () {
                FormStageEndpoint.delete({
                    formId: $scope.survey.id,
                    id: task.id
                }).$promise.then(function () {
                    // Remove stage from scope, binding should take care of the rest
                    $translate('notify.form.destroy_stage_success', {name: task.label}).then(function (message) {
                        Notify.showNotificationSlider(message);
                    });

                    $scope.survey.tasks = _.filter($scope.survey.tasks, function (item) {
                        return item.id !== task.id;
                    });

                });
            });
        });
    }
    // END - modify task

    //Start - modify Survey

    function deleteSurvey() {
        $translate('notify.form.delete_form_confirm')
        .then(function (message) {
            Notify.showConfirm(message).then(function () {
                FormEndpoint.delete({
                    id: $scope.survey.id
                }).$promise.then(function () {
                    $translate('notify.form.destroy_form_success', { name: $scope.survey.name }).then(function (message) {
                        Notify.showNotificationSlider(message);
                    });
                    $location.url('/settings/surveys');
                });
            });
        });
    }

    function saveSurvey(){
        // Saving a survey is a 3 step process

        // First save the actual survey
        FormEndpoint
        .saveCache($scope.survey)
        .$promise
        .then(function () {
            $translate('notify.form.edit_form_success', { name: $scope.survey.name }).then(function (message) {
                Notify.showNotificationSlider(message);
            });
        }, function (errorResponse) {
            Notify.showApiErrors(errorResponse);
        });

        // Second save the survey tasks

        // Third save the survey task attributes
    }

    $scope.saveNewTask = function(task) {
        var lastPriority = $scope.form.stages.length ? _.last($scope.survey.tasks).priority : 0;
        FormStageEndpoint
        .saveCache(_.extend(task, {
            formId: $scope.survey.id,
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
            $scope.setVisibleStage(stage.id);
        }, function (errorResponse) {
            Notify.showApiErrors(errorResponse);
        });
    };

    $scope.refreshStages = function () {
        FormStageEndpoint
        .query({ formId: $scope.formId })
        .$promise
        .then(function (results) {
            $scope.form.stages = _.sortBy(results, 'priority');
        });
    };









    // Manage stage settings
    $scope.isNewStageOpen = false;
    $scope.openNewStage = function () {
        $scope.newStage = {};
        $scope.isNewStageOpen = !$scope.isNewStageOpen;
    };

    $scope.editStage = function (stage) {
        $scope.newStage = stage;
        $scope.isNewStageOpen = !$scope.isNewStageOpen;
    };



    $scope.isNewAttributeOpen = false;
    var newAttrCount = 0;
    $scope.openNewAttribute = function () {
        $scope.isNewAttributeOpen = true;
    };
    $scope.addNewAttribute = function (attribute) {
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
        var newAttribute = _.clone(attribute);
        newAttribute.label = 'New ' + attribute.label.toLowerCase() + ' field';
        newAttribute.required = false;
        newAttribute.options = [];
        newAttribute.config = {};
        newAttribute.priority = lastPriority + 1;
        newAttribute.form_stage_id = $scope.visibleStage;

        $scope.form.attributes.push(newAttribute);
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
            input: 'checkbox',
            cardinality: 0
        },
        {
            label: 'Related Post',
            type: 'relation',
            input: 'relation'
        },
        {
            label: 'Image',
            type: 'media',
            input: 'upload'
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
