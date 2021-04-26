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
    '$rootScope',
    '$scope',
    '$q',
    '$location',
    '$translate',
    '$state',
    'FormRoleEndpoint',
    'ConfigEndpoint',
    'RoleEndpoint',
    '_',
    'Notify',
    'SurveyNotify',
    'ModalService',
    'Features',
    'SurveysSdk',
    'TranslationService',
    'CategoriesSdk'];
function SurveyEditorController(
    $rootScope,
    $scope,
    $q,
    $location,
    $translate,
    $state,
    FormRoleEndpoint,
    ConfigEndpoint,
    RoleEndpoint,
    _,
    Notify,
    SurveyNotify,
    ModalService,
    Features,
    SurveysSdk,
    TranslationService,
    CategoriesSdk
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

    $scope.openFieldModal = openFieldModal;
    $scope.openFieldEditModal = openFieldEditModal;
    $scope.addNewField = addNewField;

    $scope.moveFieldUp = moveFieldUp;
    $scope.moveFieldDown = moveFieldDown;
    $scope.isFirstField = isFirstField;
    $scope.isLastField = isLastField;

    $scope.deleteField = deleteField;
    $scope.saving_survey = false;
    $scope.saveSurvey = saveSurvey;
    $scope.cancel = cancel;

    $scope.toggleTaskRequired = toggleTaskRequired;
    $scope.toggleFieldRequired = toggleFieldRequired;
    $scope.toggleTaskPublic = toggleTaskPublic;

    $scope.changeTaskLabel = changeTaskLabel;

    $scope.getInterimId = getInterimId;
    $scope.removeInterimIds = removeInterimIds;

    $scope.switchTab = switchTab;
    $scope.tab_history = {};

    $scope.loadRoleData = loadRoleData;
    $scope.roles_allowed = [];
    $scope.roles = [];
    $scope.languagesToSelect = require('../../common/global/language-list.json');

    $scope.onlyOptional = onlyOptional;
    $scope.anonymiseReportersEnabled = false;
    $scope.location_precision = 1000;
    $scope.showLangError = false;

    activate();

    function activate() {
        $scope.tab_history = {};

        // Set initial menu tab
        $scope.switchTab('post', 'survey-build');
        $scope.loadRoleData();
        $scope.save = $translate.instant('app.save');
        $scope.saving = $translate.instant('app.saving');
        ConfigEndpoint.get({id: 'map'}, function (map) {
            $scope.location_precision = 1000 / Math.pow(10, map.location_precision);
        });

        Features.loadFeatures()
        .then(() => {
            $scope.targetedSurveysEnabled = Features.isFeatureEnabled('targeted-surveys');
            $scope.anonymiseReportersEnabled = Features.isFeatureEnabled('anonymise-reporters');
        });

        if ($scope.surveyId) {
            loadFormData();
        } else {
            // When creating new survey
            // pre-fill object with default tasks and attributes
            $scope.survey =    {
                color: null,
                require_approval: true,
                everyone_can_create: true,
                translations:{},
                tasks: [
                    {
                        priority: 0,
                        required: false,
                        type: 'post',
                        label: 'Post',
                        show_when_published: true,
                        task_is_internal_only: false,
                        translations: {},
                        fields: [
                            {
                                cardinality: 0,
                                input: 'text',
                                priority: 1,
                                required: true,
                                label: 'Title',
                                type: 'title',
                                config: {},
                                form_stage_id: getInterimId(),
                                translations:{}
                            },
                            {
                                cardinality: 0,
                                input: 'text',
                                priority: 2,
                                required: true,
                                label: 'Description',
                                type: 'description',
                                options: [],
                                config: {},
                                form_stage_id: getInterimId(),
                                translations:{}
                            }
                        ],
                        is_public: true
                    }
                ]
            };
            TranslationService.getLanguage().then(language => {
                //active language is the same as default when starting out.
                if (!$scope.survey.enabled_languages) {
                    $scope.survey.enabled_languages = {
                        default: language,
                        available: []
                    }
                    $scope.languages = {
                        default: $scope.survey.enabled_languages.default,
                        active: $scope.survey.enabled_languages.default,
                        available: $scope.survey.enabled_languages.available,
                        surveyLanguages: [$scope.survey.enabled_languages.default, ...$scope.survey.enabled_languages.available]
                    }
                    }
                });
            $scope.survey.tasks[0].id = $scope.getInterimId();
        }

        if (!$scope.surveyId) {

            $q.all([Features.loadFeatures(), SurveysSdk.getSurveysTo('count')]).then(function (data) {
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

    function onlyOptional(editField) {
        return editField.type !== 'title' && editField.type !== 'description';
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

    function getInterimId() {
        const id = 'interim_id_' + $scope.currentInterimId;
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
        SurveysSdk.getSurveysTo('list_and_permissions').then(function (forms) {
            $scope.availableSurveys = forms;
            $scope.$apply();
        });
    }

    function loadAvailableCategories() {
        // Get available categories.
        CategoriesSdk.getCategories().then(function (tags) {
            $scope.availableCategories = tags;
            // adding category-objects attribute-options
            $scope.availableCategories = _.chain($scope.availableCategories)
                .map(function (category) {
                    const ret = _.findWhere($scope.availableCategories, {id: category.id});
                    if (ret && ret.children.length > 0) {
                        ret.children = _.chain(ret.children)
                            .map(function (child) {
                                return _.findWhere($scope.availableCategories, {id: child.id});
                            })
                            .filter()
                            .value();
                    }
                    return ret;
                })
                .filter()
                .value();
            $scope.$apply();
        });
    }

    function loadFormData() {
        // If we're editing an existing survey,
        // load the survey info and all the fields.
        SurveysSdk.findSurvey($scope.surveyId).then(res => {
            //Getting roles for the survey
            $scope.survey = res;

            TranslationService.getLanguage().then(language => {
                //active language is the same as default when starting out.
                if (!$scope.survey.enabled_languages) {
                    $scope.survey.enabled_languages = {
                        default: language,
                        available: []
                    }
                }
                if ($scope.survey.enabled_languages.default === '') {
                    $scope.survey.enabled_languages.default = language;
                }
                $scope.languages = {
                    default: $scope.survey.enabled_languages.default,
                    active: $scope.survey.enabled_languages.default,
                    available: $scope.survey.enabled_languages.available,
                    surveyLanguages: [$scope.survey.enabled_languages.default, ...$scope.survey.enabled_languages.available]
                }
                $scope.selectedLanguage = $scope.survey.enabled_languages.default;
            });

            // Making sure translations are of type objects
            // make required
            $scope.survey.translations = Object.assign({}, $scope.survey.translations);
            _.map($scope.survey.tasks, task => {
                task.translations = Object.assign({}, task.translations);
                delete task.icon;
                _.map(task.fields,field => {
                    field.translations = Object.assign({}, field.translations);
                });
            });
            getRoles($scope.survey.id);
            // removing data if duplicated survey
            if ($scope.actionType === 'duplicate') {
                delete $scope.survey.id;
                delete $scope.survey.created;
                delete $scope.survey.updated;
                delete $scope.survey.url;
                delete $scope.survey.can_create;
                delete $scope.survey.tags;
                // Reset Task and Field IDs
                _.each($scope.survey.tasks, function (task) {
                    task.form_id = undefined;
                    task.id = $scope.getInterimId();
                    delete task.url;

                    _.each(task.fields, function (field) {
                        field.form_stage_id = task.id;
                        delete field.id;
                        delete field.url;
                        delete field.key;
                    });
                });
            }
        });
    }

    function getRoles() {
        FormRoleEndpoint.queryFresh({ formId: $scope.surveyId }).$promise.then(res=>{
            $scope.roles_allowed = _.pluck(res, 'role_id');
        })
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

    function handleResponseErrors(error) {
        $scope.saving_survey = false;
        Notify.sdkErrors(error);
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
    function isFirstField(task, field) {
        var fields = task.fields,
            // Find our current field
            index = _.indexOf(fields, field);
        return index === 0;
    }

    function isLastField(task, field) {
        var fields = task.fields,
            // Find our current field
            index = _.indexOf(fields, field);
        return index === fields.length - 1;
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

    function moveFieldUp(task, field) {
        changeFieldPriority(task, field, -1);
    }

    function moveFieldDown(task, field) {
        changeFieldPriority(task, field, 1);
    }

    function changeFieldPriority(task, field, increment) {
        var fields = task.fields,
            // Find our current stage
            index = _.indexOf(fields, field),
            // Grab prev/next stage
            next = fields[index + increment];

        // Check we're not at the end of the list
        if (_.isUndefined(next)) {
            return;
        }
        // Swap priorities
        next.priority = field.priority;
        field.priority = field.priority + increment;

        // Resort field list
        task.fields = _.sortBy(fields, 'priority');
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
        // it's fields form_stage_id as this is their linkage
        if (!task.id) {
            _.each(task.fields, function (field) {
                field.form_stage_id = task.label;
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

    function getNewFieldPriority(task) {
        return task.fields.length ? _.last(task.fields).priority + 1 : 0;
    }

    function addNewTask(task) {
        ModalService.close();
        // Set task priority
        task.priority = getNewTaskPriority();
        task.id = $scope.getInterimId();
        $scope.survey.tasks.push(task);
        $scope.switchTab(task.id, 'section-build');
    }

    function openFieldModal(task) {
        // Set active task so we know who this field will belong to
        $scope.activeTask = task;
        ModalService.openTemplate('<survey-attribute-create></survey-attribute-create>', 'survey.add_field', '', $scope, true, true);
    }

    function openFieldEditModal(task, field) {
        // If creating a new field we need to close
        // the type picker first
        $scope.activeTask = task;
        if (!field.form_stage_id) {
            ModalService.close();
        }

        $scope.editField = field;
        let fieldType = getFieldType(field) ? getFieldType(field) : field.label;
        let title = field.id ? $translate.instant('survey.edit_field', {fieldType: fieldType}) : $translate.instant('survey.add_field', {fieldType: fieldType});
        title = title.replace('&amp;', '&');
        switch (field.type) {
            case 'relation':
                loadAvailableForms();
                break;
            case 'tags':
                loadAvailableCategories();
                break;
        }

        ModalService.openTemplate('<survey-attribute-editor></survey-attribute-editor>', title, '', $scope, true, true);
    }

    function getFieldType(attribute) {
        var fieldTypes = {
            'text': {
                'varchar': $translate.instant('survey.short_text')
            },
            'textarea': {
                'text': $translate.instant('survey.long_text')
            },
            'number': {
                'decimal': $translate.instant('survey.number_decimal'),
                'int': $translate.instant('survey.number_integer')
            },
            'location': {
                'point': $translate.instant('survey.location')
            },
            'date': {
                'datetime': $translate.instant('survey.date')
            },
            'datetime': {
                'datetime': $translate.instant('survey.datetime')
            },
            'select': {
                'varchar': $translate.instant('survey.select')
            },
            'radio': {
                'varchar': $translate.instant('survey.radio_button')
            },
            'checkbox': {
                'varchar': $translate.instant('survey.checkbox')
            },
            'relation' : {
                'relation': $translate.instant('survey.related_post')
            },
            'upload' : {
                'media': $translate.instant('survey.upload_image')
            },
            'video' : {
                'varchar': $translate.instant('survey.embed_video')
            },
            'markdown' : {
                'markdown': 'Markdown'
            },
            'tags' : {
                'tags': $translate.instant('survey.categories')
            }
        }
        return fieldTypes[attribute.input] ? fieldTypes[attribute.input][attribute.type] : null;
    }
    function addNewField(field, task) {
        ModalService.close();
        // Set active task as form_stage_id
        // If this task is new and has not been saved
        // it won't have an id so in this instance we use its label
        // Labels are not guaranteed to be unique
        // TODO refactor this
        if (!field.form_stage_id) {
            // Set field priority
            field.priority = getNewFieldPriority(task);
            field.form_stage_id = task.id ? task.id : task.label;
            task.fields.push(field);
        }
    }

    function deleteField(field, task) {
        Notify.confirmDelete('notify.form.delete_attribute_confirm', 'notify.form.delete_attribute_confirm_desc').then(function () {
            // If we have not yet saved this field
            // we can drop it immediately
            if (!field.id) {
                task.fields = _.filter(task.fields, function (item) {
                    return item.label !== field.label;
                });
            } else {
                task.fields = _.filter(task.fields, function (item) {
                    return item.id !== field.id;
                });
            }

            Notify.notify('notify.form.destroy_attribute_success', {name: field.label});
        });
    }

    function duplicateSection(task) {
        var dup = angular.copy(task);
        dup.label = undefined;
        dup.description = undefined;
        dup.id = getInterimId();
        _.each(dup.fields, function (field) {
            delete field.id;
            delete field.url;
            delete field.key;
            field.form_stage_id = dup.id;
        });
        $scope.survey.tasks.push(dup);
        $scope.switchTab(dup.id, 'section-build');
    }

    function deleteTask(task) {
        Notify.confirmDelete('notify.form.delete_stage_confirm', 'notify.form.delete_stage_confirm_desc').then(function () {
            // If we haven't saved the task yet then we can just drop it
            if (!task.id || _.isString(task.id)) {
                $scope.survey.tasks = _.filter($scope.survey.tasks, function (item) {
                    return item.label !== task.label;
                });
            } else {
                 $scope.survey.tasks = _.filter($scope.survey.tasks, function (item) {
                    return item.id !== task.id;
                });
            }
            Notify.notify('notify.form.destroy_stage_success', {name: task.label});

        });
    }
    // END - modify task

    //Start - modify Survey
    function saveSurvey() {
        // Set saving to true to disable user actions
        $scope.saving_survey = true;
        // check there is translations for survey-names in all languages
        if (validateSurveyTranslations() && validateAttributeOptionTranslations()) {
        // Save the survey
        $scope.removeInterimIds();
        $scope.survey.base_language = $scope.survey.enabled_languages.default;
        SurveysSdk.saveSurvey($scope.survey).then(response => {
            $scope.survey = response.data.result;
            saveRoles();
            // Display success message
            SurveyNotify.success(
                'notify.form.edit_form_success',
                { name: $scope.survey.name },
                { formId: $scope.survey.id }
            );

            // Redirect to survey list
            $state.go('settings.surveys', {}, { reload: true });
        })
        // Catch and handle errors
        .catch(handleResponseErrors);
    } else {
        $scope.saving_survey = false;
        $rootScope.$broadcast('event:surveys:translationMissing');
        Notify.error(`You need to add translations for all names, and ensure checkboxes and radios do not have duplicates.
         Check that you have translated the survey-names for all added languages and that your checkbox and radio button values are unique (within each language).`);
    }
    }
    function validateAttributeOptionTranslations() {
        return _.every($scope.survey.enabled_languages.available, language => {
            return $scope.survey.tasks.every((t) =>  {
                return t.fields.every(f => {
                    if (
                        SurveysSdk.fieldHasTranslations(f, language)
                        && SurveysSdk.fieldCanHaveOptions(f)
                    ) {
                        return SurveysSdk.areOptionsUnique(
                            Object.values(f.translations[language].options)
                        );
                    }
                    return true;
                });
            });
        });
    }
    function validateSurveyTranslations() {
        return _.every($scope.survey.enabled_languages.available, language => {
            return $scope.survey.translations[language] && $scope.survey.translations[language].name;
        });
    }

    function saveRoles() {
        // adding admin to roles_allowed if not already there
        let admin = _.findWhere($scope.roles, {name: 'admin'});
        if (!$scope.survey.everyone_can_create && _.indexOf($scope.roles_allowed, admin.id) === -1) {
            $scope.roles_allowed.push(admin.id);
        }
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

    function toggleFieldRequired(attribute) {
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

    // Translations
    $scope.removeLanguage = function(index, language) {
        Notify.confirmModal('Are you sure you want to remove this language and all the translations?','','','','Remove language', 'cancel')
        .then(function() {
            $scope.survey.enabled_languages.available.splice(index,1);
            delete $scope.survey.translations[language];
            _.map($scope.survey.tasks, task => {
                delete task.translations[language];
                _.map(task.fields, field => {
                    delete field.translations[language];
                });
            });
            $scope.languages.active = $scope.languages.default;
        });
    };

    $scope.selectLanguage = function  (language) {
        if ($scope.survey.enabled_languages.available.indexOf(language) > -1) {
            $scope.showLangError = true;
        } else {
            $scope.showLangError = false;
            $scope.languages = {
                default: language,
                active:language,
                available: $scope.survey.enabled_languages.available

            }
            $scope.survey.enabled_languages.default = language;
        }
    }
}
