angular.module('ushahidi.settings', [])
.directive('afterImportCsv', require('./data-import/data-after-import.directive.js'))
.directive('importerCsv', require('./data-import/data-import.directive.js'))
.service('ImportNotify', require('./data-import/import.notify.service.js'))

.directive('surveyEditor', require('./surveys/survey-editor.directive.js'))
.directive('surveyTaskCreate', require('./surveys/task-create.directive.js'))
.directive('surveyAttributeCreate', require('./surveys/attribute-create.directive.js'))
.directive('surveyAttributeEditor', require('./surveys/attribute-editor.directive.js'))
.service('SurveyNotify', require('./surveys/survey.notify.service.js'))

.directive('settingsList', require('./settings-list.directive.js'))
.directive('settingsMap', require('./site/map.directive.js'))
.directive('settingsEditor', require('./site/editor.directive.js'))

.directive('filterUsers', require('./users/filter-users.directive.js'))

.directive('customRoles', require('./roles/roles.directive.js'))
.directive('customRolesEditor', require('./roles/editor.directive.js'))

.directive('customWebhooks', require('./webhooks/webhooks.directive.js'))
.directive('customWebhooksEditor', require('./webhooks/editor.directive.js'))

.config(require('./settings.routes.js'));
