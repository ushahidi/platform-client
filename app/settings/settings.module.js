angular.module('ushahidi.settings', [])
.directive('afterImportCsv', require('./data-import/data-after-import.directive.js'))
.directive('importerCsv', require('./data-import/data-import.directive.js'))
.service('ImportNotify', require('./data-import/import.notify.service.js'))
.directive('hdxDetails', require('./data-export/hdx-details.directive.js'))

.directive('surveyEditor', require('./surveys/survey-editor.directive.js'))
.directive('surveyTranslationEditor', require('./surveys/survey-translation-editor.directive.js'))
.directive('fieldTranslationEditor', require('./surveys/field-translation-editor.directive.js'))
.directive('surveyTaskCreate', require('./surveys/task-create.directive.js'))
.directive('surveyAttributeCreate', require('./surveys/attribute-create.directive.js'))
.directive('surveyAttributeEditor', require('./surveys/attribute-editor.directive.js'))
.service('SurveyNotify', require('./surveys/survey.notify.service.js'))
.directive('targetedQuestion', require('./surveys/targeted-surveys/targeted-question.directive.js'))
.directive('settingsMap', require('./site/map.directive.js'))
.directive('settingsEditor', require('./site/editor.directive.js'))
.directive('categoryTranslationEditor', require('./categories/category-translation-editor.directive.js'))
.directive('filterUsers', require('./users/filter-users.directive.js'))

.directive('customRoles', require('./roles/roles.directive.js'))
.directive('customRolesEditor', require('./roles/editor.directive.js'))

.directive('customWebhooks', require('./webhooks/webhooks.directive.js'))
.directive('customWebhooksEditor', require('./webhooks/editor.directive.js'))

.directive('setupDonation', require('./donation/donation.directive.js'))

.config(require('./settings.routes.js'));
