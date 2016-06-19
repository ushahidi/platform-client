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
    'Notify',
    'ModalService',
    'Features'
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
    Notify,
    ModalService,
    Features
) {

    $scope.canReorderTask = canReorderTask;
    $scope.moveTaskUp = moveTaskUp;
    $scope.moveTaskDown = moveTaskDown;
    $scope.isFirstTask = isFirstTask;
    $scope.isLastTask = isLastTask;

    $scope.deleteTask = deleteTask;
    $scope.openTaskModal = openTaskModal;
    $scope.addNewTask = addNewTask;

    $scope.openAttributeModal = openAttributeModal;
    $scope.openAttributeEditModal = openAttributeEditModal;
    $scope.addNewAttribute = addNewAttribute;
    $scope.labelChanged = labelChanged;

    $scope.moveAttributeUp = moveAttributeUp;
    $scope.moveAttributeDown = moveAttributeDown;
    $scope.isFirstAttribute = isFirstAttribute;
    $scope.isLastAttribute = isLastAttribute;

    $scope.deleteAttribute = deleteAttribute;

    $scope.deleteSurvey = deleteSurvey;
    $scope.saveSurvey = saveSurvey;
    $scope.cancel = cancel;

    $scope.toggleTaskRequired = toggleTaskRequired;
    $scope.toggleAttributeRequired = toggleAttributeRequired;

    $scope.changeTaskLabel = changeTaskLabel;

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
            $scope.survey = {
                tasks: [
                    {
                        label: 'Post',
                        priority: 0,
                        required: true,
                        attributes: []
                    }
                ]
            };
        }

        loadAvailableForms();

        if (!$scope.surveyId) {
            $q.all([Features.loadFeatures(), FormEndpoint.query().$promise]).then(function (data) {
                var forms_limit = Features.getLimit('forms');
                if (forms_limit === true) { // when limit is TRUE , it means no limit
                    forms_limit = Number.MAX_SAFE_INTEGER
                }
                if (forms_limit <= data[1].length) {
                    Notify.limit('limit.post_type_limit_reached');
                    $location.path('settings/surveys');
                }
            });
        }
    }

    function loadAvailableForms() {
        // Get available forms for relation field
        FormEndpoint.query().$promise.then(function (forms) {
            $scope.availableForms = forms;
        });
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
            var attributes = _.chain(results[2])
                .sortBy('priority')
                .value();
            _.each(survey.tasks, function (task) {
                task.attributes = _.filter(attributes, function (attribute) {
                    return attribute.form_stage_id === task.id;
                });
            });
            //survey.grouped_attributes = _.sortBy(survey.attributes, 'form_stage_id');
            $scope.survey = survey;
        });
    }

    function cancel() {
        $location.url('/settings/surveys');
    }

    function handleResponseErrors(errorResponse) {
        Notify.apiErrors(errorResponse);
    }

    // START -- Reorder tasks
    // This function assumes the default
    // Post task is unmoveable
    function isFirstTask(task) {
        var tasks = $scope.survey.tasks,
            // Find our current stage
            index = _.indexOf(tasks, task);
        return index === 1;
    }

    function isLastTask(task) {
        var tasks = $scope.survey.tasks,
            // Find our current stage
            index = _.indexOf(tasks, task);
        return index === tasks.length - 1;
    }

    // START -- Reorder tasks
    function isFirstAttribute(task, attribute) {
        var attributes = task.attributes,
            // Find our current attribute
            index = _.indexOf(attributes, attribute);
        return index === 0;
    }

    function isLastAttribute(task, attribute) {
        var attributes = task.attributes,
            // Find our current attribute
            index = _.indexOf(attributes, attribute);
        return index === attributes.length - 1;
    }

    function canReorderTask(task) {
        //Only the Post task can not be reordered
        return task.label !== 'Post';
    }

    // Update key based on label
    function labelChanged(attribute) {
        if (!attribute.id) {
            attribute.key = attribute.label.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-_]+/g, '').toLowerCase();
        }
    }

    function moveTaskUp(task) {
        changeTaskPriority(task, -1);
    }

    function moveTaskDown(task) {
        changeTaskPriority(task, 1);
    }

    function moveAttributeUp(task, attribute) {
        changeAttributePriority(task, attribute, -1);
    }

    function moveAttributeDown(task, attribute) {
        changeAttributePriority(task, attribute, 1);
    }

    function changeAttributePriority(task, attribute, increment) {
        var attributes = task.attributes,
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

        // Resort attribute list
        task.attributes = _.sortBy(attributes, 'priority');
    }

    function changeTaskPriority(task, increment) {
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

    function changeTaskLabel(task) {
        // Task labels must be unique

        // If the task is not yet saved we need to make sure to update
        // it's attributes form_stage_id as this is their linkage
        if (!task.id) {
            _.each(task.attributes, function (attribute) {
                attribute.form_stage_id = task.label;
            });
        }

    }
    // END - reorder tasks

    // Start Modify Tasks
    function openTaskModal() {
        ModalService.openTemplate('<survey-task-create></survey-task-create>', 'survey.add_task', '', $scope, true, true);
    }

    function getNewTaskPriority() {
        return $scope.survey.tasks.length ? _.last($scope.survey.tasks).priority + 1 : 0;
    }

    function getNewAttributePriority() {
        return $scope.activeTask.attributes.length ? _.last($scope.activeTask.attributes).priority + 1 : 0;
    }

    function addNewTask(task) {
        ModalService.close();
        // Set task priority
        task.priority = getNewTaskPriority();
        $scope.survey.tasks.push(task);
    }

    function openAttributeModal(task) {
        // Set active task so we know who this attribute will belong to
        $scope.activeTask = task;
        ModalService.openTemplate('<survey-attribute-create></survey-attribute-create>', 'survey.add_field', '', $scope, true, true);
    }

    function openAttributeEditModal(task, attribute) {
        // If creating a new attribute we need to close
        // the type picker first
        $scope.activeTask = task;
        if (!attribute.form_stage_id) {
            ModalService.close();
        }
        $scope.editAttribute = attribute;
        ModalService.openTemplate('<survey-attribute-editor></survey-attribute-editor>', 'survey.edit_field', '', $scope, true, true);
    }

    function addNewAttribute(attribute) {
        ModalService.close();
        // Set active task as form_stage_id
        // If this task is new and has not been saved
        // it won't have an id so in this instance we use its label
        // Labels are not guaranteed to be unique
        // TODO refactor this
        if (!attribute.form_stage_id) {
            // Set attribute priority
            attribute.priority = getNewAttributePriority();
            attribute.form_stage_id = $scope.activeTask.id ? $scope.activeTask.id : $scope.activeTask.label;
            $scope.activeTask.attributes.push(attribute);
        }
    }

    function deleteAttribute(attribute) {
        // If we have not yet saved this attribute
        // we can drop it immediately
        if (!attribute.id) {
            $scope.activeTask.attributes = _.filter($scope.activeTask.attributes, function (item) {
                return item.label !== attribute.label;
            });
            // Attribute delete is currently only available in modal
            // so close the modal
            ModalService.close();
            return;
        }

        Notify.confirmDelete('notify.form.delete_attribute_confirm').then(function () {
            FormAttributeEndpoint.delete({
                formId: $scope.survey.id,
                id: attribute.id
            }).$promise.then(function (attribute) {
                // Remove attribute from scope, binding should take care of the rest
                var index = _.findIndex($scope.activeTask.attributes, function (item) {
                    return item.id === attribute.id;
                });

                $scope.activeTask.attributes.splice(index, 1);

                FormStageEndpoint.invalidateCache();

                Notify.notify('notify.form.destroy_attribute_success', {name: attribute.label});

                // Attribute is only available in modal so
                // close the modal
                ModalService.close();
            });
        });
    }

    function deleteTask(task) {
        // If we haven't saved the task yet then we can just drop it
        if (!task.id) {
            $scope.survey.tasks = _.filter($scope.survey.tasks, function (item) {
                return item.label !== task.label;
            });
            return;
        }

        Notify.confirm('notify.form.delete_stage_confirm').then(function () {
            FormStageEndpoint.delete({
                formId: $scope.survey.id,
                id: task.id
            }).$promise.then(function () {
                // Remove stage from scope, binding should take care of the rest
                Notify.notify('notify.form.destroy_stage_success', {name: task.label});

                $scope.survey.tasks = _.filter($scope.survey.tasks, function (item) {
                    return item.id !== task.id;
                });

            });
        });
    }
    // END - modify task

    //Start - modify Survey

    function deleteSurvey() {
        // If we haven't saved the survey
        // just go back to the surveys views
        if (!$scope.survey.id) {
            $location.url('/settings/surveys');
            return;
        }

        Notify.confirmDelete('notify.form.delete_form_confirm').then(function () {
            FormEndpoint.delete({
                id: $scope.survey.id
            }).$promise.then(function () {
                Notify.notify('notify.form.destroy_form_success', { name: $scope.survey.name });
                $location.url('/settings/surveys');
            }, handleResponseErrors);
        });
    }

    function saveSurvey() {
        // Saving a survey is a 3 step process

        // First save the actual survey
        FormEndpoint
        .saveCache($scope.survey)
        .$promise
        .then(function (survey) {
            $scope.survey.id = survey.id;
            // Second save the survey tasks
            saveTasks();
        }, handleResponseErrors);
    }

    function saveTasks(tasks) {
        var calls = [];

        _.each($scope.survey.tasks, function (task) {
            task.form_id = $scope.survey.id;
            // Add each task to save loop
            calls.push(
                FormStageEndpoint
                .saveCache(_.extend(task, {formId: $scope.survey.id})).$promise
            );
        });

        // TODO add notify and error states
        $q.all(calls).then(function (tasks) {
            // Update survey object with saved tasks
            // We need to preserve the tasks attributes
            // so we clone them and then reinstate them

            // First we ensure they are ordered by priority
            tasks = _.sortBy(tasks, 'priority');

            // Next we associate them with the existing tasks
            // to preserve associated attributes
            _.each(tasks, function (task, index) {
                _.extend($scope.survey.tasks[index], task);
            });
            // Third save the survey task attributes
            saveAttributes();
        }, handleResponseErrors);
    }

    function saveAttributes() {
        var calls = [];

        _.each($scope.survey.tasks, function (task) {
            _.each(task.attributes, function (attribute) {
                attribute.form_stage_id = task.id;
                calls.push(
                    FormAttributeEndpoint
                    .saveCache(_.extend(attribute, {formId: $scope.survey.id})).$promise
                );
            });
        });

        $q.all(calls).then(function (attributes) {
            // Update survey object with saved attributes
            _.each($scope.survey.tasks, function (task) {
                task.attributes = _.filter(attributes, function (attribute) {
                    return attribute.form_stage_id === task.id;
                });
            });

            Notify.notify('notify.form.edit_form_success', { name: $scope.survey.name });
        }, handleResponseErrors);
    }

    function toggleTaskRequired(task) {
        task.required = !task.required;
    }

    function toggleAttributeRequired(attribute) {
        attribute.required = !attribute.required;
    }

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



}
