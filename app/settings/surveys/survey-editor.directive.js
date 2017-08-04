module.exports = SurveyEditor;

SurveyEditor.$inject = [];
function SurveyEditor() {
    return {
        restrict: 'E',
        scope: {
            surveyId: '=',
            actionType: '='
        },
        controller: SurveyEditorController,
        template: require('./survey-editor.html')
    };
}

SurveyEditorController.$inject = [
    '$scope',
    '$q',
    '$location',
    '$translate',
    'FormEndpoint',
    'FormRoleEndpoint',
    'FormStageEndpoint',
    'FormAttributeEndpoint',
    'RoleEndpoint',
    'TagEndpoint',
    '_',
    'Notify',
    'SurveyNotify',
    'ModalService',
    'Features'
];
function SurveyEditorController(
    $scope,
    $q,
    $location,
    $translate,
    FormEndpoint,
    FormRoleEndpoint,
    FormStageEndpoint,
    FormAttributeEndpoint,
    RoleEndpoint,
    TagEndpoint,
    _,
    Notify,
    SurveyNotify,
    ModalService,
    Features
) {
    $scope.saving = false;
    $scope.currentInterimId = 0;
    $scope.survey = {
        color: null
    };
    $scope.canReorderTask = canReorderTask;
    $scope.moveTaskUp = moveTaskUp;
    $scope.moveTaskDown = moveTaskDown;
    $scope.isFirstTask = isFirstTask;
    $scope.isLastTask = isLastTask;
    $scope.deleteTask = deleteTask;
    $scope.duplicateSection = duplicateSection;
    $scope.openTaskModal = openTaskModal;
    $scope.addNewTask = addNewTask;

    $scope.openAttributeModal = openAttributeModal;
    $scope.openAttributeEditModal = openAttributeEditModal;
    $scope.addNewAttribute = addNewAttribute;

    $scope.moveAttributeUp = moveAttributeUp;
    $scope.moveAttributeDown = moveAttributeDown;
    $scope.isFirstAttribute = isFirstAttribute;
    $scope.isLastAttribute = isLastAttribute;

    $scope.deleteAttribute = deleteAttribute;
    $scope.saving_survey = false;
    $scope.saveSurvey = saveSurvey;
    $scope.cancel = cancel;

    $scope.toggleTaskRequired = toggleTaskRequired;
    $scope.toggleAttributeRequired = toggleAttributeRequired;
    $scope.toggleTaskPublic = toggleTaskPublic;

    $scope.changeTaskLabel = changeTaskLabel;

    $scope.getInterimId = getInterimId;
    $scope.removeInterimIds = removeInterimIds;

    $scope.allowedToggleOrder = allowedToggleOrder;

    $scope.switchTab = switchTab;

    $scope.loadRoleData = loadRoleData;
    $scope.roles_allowed = [];
    $scope.roles = [];

    $scope.onlyOptional = onlyOptional;

    activate();

    function activate() {
        $scope.tab_history = {};

        // Set initial menu tab
        $scope.switchTab('post', 'survey-build');

        $scope.loadRoleData();
        $scope.save = $translate.instant('app.save');
        $scope.saving = $translate.instant('app.saving');

        if ($scope.surveyId) {
            loadFormData();
        } else {
            // When creating new survey
            // pre-fill object with default tasks and attributes
            $scope.survey = {
                color: null,
                require_approval: true,
                everyone_can_create: true,
                tasks: [
                    {
                        label: 'Post',
                        priority: 0,
                        required: false,
                        type: 'post',
                        show_when_published: false,
                        task_is_internal_only: false,
                        attributes: [
                            {
                                cardinality: 0,
                                input: 'text',
                                label: 'Title',
                                priority: 1,
                                required: true,
                                type: 'title',
                                options: [],
                                config: {},
                                form_stage_id: getInterimId()
                            },
                            {
                                cardinality: 0,
                                input: 'text',
                                label: 'Description',
                                priority: 2,
                                required: true,
                                type: 'description',
                                options: [],
                                config: {},
                                form_stage_id: getInterimId()
                            }
                        ],
                        is_public: true
                    }
                ]
            };

            $scope.survey.tasks[0].id = $scope.getInterimId();
        }

        loadAvailableForms();
        loadAvailableCategories();

        if (!$scope.surveyId) {
            $q.all([Features.loadFeatures(), FormEndpoint.queryFresh().$promise]).then(function (data) {
                var forms_limit = Features.getLimit('forms');
                // When limit is TRUE , it means no limit
                // @todo run check before render
                if (forms_limit !== true && forms_limit <= data[1].length) {
                    Notify.limit('limit.post_type_limit_reached');
                    $location.path('settings/surveys');
                }
            });
        }
    }


    function onlyOptional(editAttribute) {
        return editAttribute.type !== 'title' && editAttribute.type !== 'description';
    }

    function switchTab(section, tab) {

        // First unset last active tab
        var old_tab = $scope.tab_history[section];
        if (old_tab) {
            var old_tab_li = old_tab + '-li';
            angular.element(document.getElementById(old_tab)).removeClass('active');
            angular.element(document.getElementById(old_tab_li)).removeClass('active');
        }
        // Set new active tab
        tab = tab + '-' + section;
        $scope.tab_history[section] = tab;
        var tab_li = tab + '-li';
        angular.element(document.getElementById(tab)).addClass('active');
        angular.element(document.getElementById(tab_li)).addClass('active');
    }

    function allowedToggleOrder(attribute) {
        return attribute.type !== 'title' && attribute.type !== 'description';
    }

    function getInterimId() {
        var id = 'interim_id_' + $scope.currentInterimId;
        $scope.currentInterimId++;
        return id;
    }

    function removeInterimIds() {
        _.each($scope.survey.tasks, function (task) {
            task.id = !_.isString(task.id) ? task.id : undefined;
        });
    }

    function loadAvailableForms() {
        // Get available forms for relation field
        FormEndpoint.queryFresh().$promise.then(function (forms) {
            $scope.availableForms = forms;
        });
    }
    function loadAvailableCategories() {
        // Get available tags for selected for or all tags if new form
        TagEndpoint.queryFresh().$promise.then(function (tags) {
            // adding children to parents
            $scope.availableCategories = _.map(_.where(tags, { parent_id: null }), function (tag) {
                if (tag && tag.children) {
                    tag.children = _.map(tag.children, function (child) {
                        return _.findWhere(tags, {id: parseInt(child.id)});
                    });
                }
                return tag;
            });
        });
    }

    function loadFormData() {
        // If we're editing an existing survey,
        // load the survey info and all the fields.
        $q.all([
            FormEndpoint.getFresh({ id: $scope.surveyId }).$promise,
            FormStageEndpoint.queryFresh({ formId: $scope.surveyId }).$promise,
            FormAttributeEndpoint.queryFresh({ formId: $scope.surveyId }).$promise,
            FormRoleEndpoint.queryFresh({ formId: $scope.surveyId }).$promise
        ]).then(function (results) {
            var survey = results[0];
            survey.tasks = _.sortBy(results[1], 'priority');
            var attributes = _.chain(results[2])
                .sortBy('priority')
                .value();
            _.each(attributes, function (attr) {
                    if (attr.type === 'tags') {
                        attr.options = _.map(attr.options, function (option) {
                            return parseInt(option);
                        });
                    }
                });
            _.each(survey.tasks, function (task) {
                // Set initial menu tab
                $scope.switchTab(task.id, 'section-build');
                task.attributes = _.filter(attributes, function (attribute) {
                    return attribute.form_stage_id === task.id;
                });
            });
            //survey.grouped_attributes = _.sortBy(survey.attributes, 'form_stage_id');
            $scope.survey = survey;

            var roles_allowed = results[3];

            $scope.roles_allowed = _.pluck(roles_allowed, 'role_id');

            // Remove source survey information
            if ($scope.actionType === 'duplicate') {

                $scope.survey.name = undefined;
                $scope.survey.description = undefined;

                delete $scope.survey.id;
                delete $scope.survey.created;
                delete $scope.survey.updated;
                delete $scope.survey.url;
                delete $scope.survey.can_create;
                delete $scope.survey.tags;

                // Reset Task and Attribute IDs
                _.each($scope.survey.tasks, function (task) {
                    task.form_id = undefined;
                    task.id = $scope.getInterimId();
                    delete task.url;

                    _.each(task.attributes, function (attribute) {
                        attribute.form_stage_id = task.id;
                        delete attribute.id;
                        delete attribute.url;
                        delete attribute.key;
                    });
                });
            }
        });
    }

    function loadRoleData() {
        $q.all([
            RoleEndpoint.query().$promise
        ]).then(function (results) {
            $scope.roles = results[0];
        });
    }

    function cancel() {
        $location.url('/settings/surveys');
    }

    function handleResponseErrors(errorResponse) {
        $scope.saving_survey = false;
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

    function getNewAttributePriority(task) {
        return task.attributes.length ? _.last(task.attributes).priority + 1 : 0;
    }

    function addNewTask(task) {
        ModalService.close();
        // Set task priority
        task.priority = getNewTaskPriority();
        task.id = $scope.getInterimId();
        $scope.survey.tasks.push(task);
        $scope.switchTab(task.id, 'section-build');
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
        var title = attribute.id ? 'survey.edit_field' : 'survey.add_field';
        ModalService.openTemplate('<survey-attribute-editor></survey-attribute-editor>', title, '', $scope, true, true);
    }

    function addNewAttribute(attribute, task) {
        ModalService.close();
        // Set active task as form_stage_id
        // If this task is new and has not been saved
        // it won't have an id so in this instance we use its label
        // Labels are not guaranteed to be unique
        // TODO refactor this
        if (!attribute.form_stage_id) {
            // Set attribute priority
            attribute.priority = getNewAttributePriority(task);
            attribute.form_stage_id = task.id ? task.id : task.label;
            task.attributes.push(attribute);
        }
    }

    function deleteAttribute(attribute, task) {
        Notify.confirmDelete('notify.form.delete_attribute_confirm', 'notify.form.delete_attribute_confirm_desc').then(function () {
            // If we have not yet saved this attribute
            // we can drop it immediately
            if (!attribute.id) {
                task.attributes = _.filter(task.attributes, function (item) {
                    return item.label !== attribute.label;
                });
                // Attribute delete is currently only available in modal
                // so close the modal
                ModalService.close();
                return;
            }

            FormAttributeEndpoint.delete({
                formId: $scope.survey.id,
                id: attribute.id
            }).$promise.then(function (attribute) {
                // Remove attribute from scope, binding should take care of the rest
                var index = _.findIndex(task.attributes, function (item) {
                    return item.id === attribute.id;
                });

                task.attributes.splice(index, 1);

                FormStageEndpoint.invalidateCache();

                Notify.notify('notify.form.destroy_attribute_success', {name: attribute.label});

                // Attribute is only available in modal so
                // close the modal
                ModalService.close();
            });
        });
    }

    function duplicateSection(task) {
        var dup = angular.copy(task);
        dup.label = undefined;
        dup.description = undefined;
        dup.id = getInterimId();
        _.each(dup.attributes, function (attribute) {
            delete attribute.id;
            delete attribute.url;
            delete attribute.key;
            attribute.form_stage_id = dup.id;
        });
        $scope.survey.tasks.push(dup);
        $scope.switchTab(dup.id, 'section-build');
    }

    function deleteTask(task) {

        Notify.confirmDelete('notify.form.delete_stage_confirm').then(function () {
            // If we haven't saved the task yet then we can just drop it
            if (!task.id || _.isString(task.id)) {
                $scope.survey.tasks = _.filter($scope.survey.tasks, function (item) {
                    return item.label !== task.label;
                });
                return;
            }

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

    function saveSurvey() {
        // Set saving to true to disable user actions
        $scope.saving_survey = true;
        // Save the survey
        FormEndpoint
        .saveCache($scope.survey)
        .$promise
        .then(function (survey) {
            // If the survey is new, cache the new id
            if ($scope.survey.id !== survey.id) {
                $scope.survey.id = survey.id;
            }
            // Save tasks and roles and return promises
            return $q.all([saveTasks(), saveRoles()]);
        })
        .then(function () {
            // Save attributes and return promises
            return saveAttributes();
        })
        .then(function () {
            // Display success message
            SurveyNotify.success(
                'notify.form.edit_form_success',
                { name: $scope.survey.name },
                { formId: $scope.survey.id }
            );
            // Redirect to survey list
            $location.url('settings/surveys');
        })
        // Catch and handle errors
        .catch(handleResponseErrors);
    }

    function saveTasks() {
        var promises = [];
        // Remove interim ids from tasks
        $scope.removeInterimIds();
        _.each($scope.survey.tasks, function (task) {
            // Assign survey id to each task
            task.form_id = $scope.survey.id;
            // Add each task to promise array
            promises.push(
                FormStageEndpoint
                .saveCache(_.extend(task, { formId: $scope.survey.id }))
                .$promise
            );
        });
        return $q.all(promises).then(function (tasks) {
            // Ensure tasks are ordered by priority
            tasks = _.sortBy(tasks, 'priority');
            // Associate tasks to preserve attributes
            _.each(tasks, function (task, index) {
                _.extend($scope.survey.tasks[index], task);
            });
        });
    }

    function saveAttributes() {
        var promises = [];
        _.each($scope.survey.tasks, function (task) {
            _.each(task.attributes, function (attribute) {
                // Remove faulty category ids from each attribute
                if (attribute.type === 'tags') {
                    attribute.options = _.filter(attribute.options, function (option) {
                        return !isNaN(option);
                    });
                }
                // Assign stage id to each attribute
                attribute.form_stage_id = task.id;
                // Add each attribute to promise array
                promises.push(
                    FormAttributeEndpoint
                    .saveCache(_.extend(attribute, { formId: $scope.survey.id }))
                    .$promise
                );
            });
        });
        return $q.all(promises);
    }

    function saveRoles() {
        return FormRoleEndpoint
        .saveCache(_.extend({ roles: $scope.roles_allowed }, { formId: $scope.survey.id }))
        .$promise;
    }

    function toggleTaskRequired(task) {
        task.required = !task.required;
    }

    function toggleTaskPublic(task) {
        task.is_public = !task.is_public;
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
