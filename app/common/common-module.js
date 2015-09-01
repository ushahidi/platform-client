angular.module('ushahidi.common', [
	'ushahidi.common.dropdown',
	'ushahidi.common.accordion',
	'ushahidi.common.offcanvas',
	'ushahidi.common.modal',
	'ushahidi.common.sticky-sidebar'
])

.service('Authentication', require('./services/authentication.js'))
.service('Session', require('./services/session.js'))
.service('ConfigEndpoint', require('./services/endpoints/config.js'))
.service('UserEndpoint', require('./services/endpoints/user-endpoint.js'))
.service('FormEndpoint', require('./services/endpoints/form.js'))
.service('FormAttributeEndpoint', require('./services/endpoints/form-attributes.js'))
.service('FormStageEndpoint', require('./services/endpoints/form-stages.js'))
.service('TagEndpoint', require('./services/endpoints/tag.js'))
.service('DataProviderEndpoint', require('./services/endpoints/data-providers.js'))
.service('FontAwesomeIcons', require('./services/endpoints/FontAwesomeIcons.js'))
.service('RoleHelper', require('./services/role-helper.js'))
.service('PostViewHelper', require('./services/view-helper.js'))
.service('Config', require('./services/config.js'))
.service('Util', require('./services/util.js'))
.service('Notify', require('./services/notify.js'))
.service('multiTranslate', require('./services/multi-translate.js'))
.service('GlobalFilter', require('./services/global-filter.js'))
.service('Maps', require('./services/maps.js'))
.service('Geocoding', require('./services/geocoding.js'))
.service('Languages', require('./services/languages.js'))
.service('Registration', require('./services/registration.js'))
.service('PasswordReset', require('./services/password-reset.js'))
.service('IconManager', require('./services/icon-manager.js'))

.controller('navigation', require('./controllers/navigation.js'))
.controller('PageMetadata', require('./controllers/page-metadata.js'))

.directive('iconPicker', require('./directives/iconpicker.js'))

.config(require('./configs/authentication-interceptor.js'))
.config(require('./configs/locale-config.js'))
.config(require('./configs/ui-bootstrap-template-decorators.js'))
.config(require('./configs/gravatar-config.js'))

.config(require('./common-routes.js'))

.run(require('./global/event-handlers.js'))
// Use language settings from config
.run(require('./global/language-settings.js'))
;

// Load submodules
require('./directives/dropdown.js');
require('./directives/accordion.js');
require('./directives/offcanvas.js');
require('./directives/modal.js');
require('./directives/sticky-sidebar.js');
