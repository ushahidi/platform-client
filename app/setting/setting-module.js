angular.module('ushahidi.tools', [])
.directive('importerCsv', require('./directives/setting-data-import-directive.js'))
.directive('mapperCsv', require('./directives/setting-data-mapper-directive.js'))
.directive('configureCsv', require('./directives/setting-data-configure-directive.js'))

.directive('surveyEditor', require('./directives/setting-survey-editor.directive.js'))
.directive('surveyTaskCreate', require('./directives/task-create.directive.js'))
.directive('surveyAttributeCreate', require('./directives/attribute-create.directive.js'))
.directive('surveyAttributeEditor', require('./directives/attribute-editor.directive.js'))

.directive('settingsList', require('./directives/setting-list-directive.js'))
.directive('settingsMap', require('./directives/setting-map-directive.js'))
.directive('settingsEditor', require('./directives/setting-editor-directive.js'))

.directive('filterUsers', require('./users/directives/filter-users.js'))

.directive('customRoles', require('./directives/setting-roles-directive.js'))
.directive('customRolesEditor', require('./directives/setting-roles-editor-directive.js'))

.service('DataImportEndpoint', require('./services/endpoints/data-import.js'))

.config(require('./setting-routes.js'));
