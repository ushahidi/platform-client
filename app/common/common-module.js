angular.module('ushahidi.common', [
	'ushahidi.common.dropdown',
	'ushahidi.common.accordion',
	'ushahidi.common.offcanvas',
	'ushahidi.common.modal',
	'ushahidi.common.custom-on-change',
	'ushahidi.common.file-upload',
	'ushahidi.common.notification-slider',
	'ushahidi.common.sticky-sidebar',
    'ushahidi.common.chart'
])

.service('Authentication', require('./services/authentication.js'))
.service('Session', require('./services/session.js'))

.service('ConfigEndpoint', require('./services/endpoints/config.js'))
.service('UserEndpoint', require('./services/endpoints/user-endpoint.js'))
.service('FormEndpoint', require('./services/endpoints/form.js'))
.service('FormAttributeEndpoint', require('./services/endpoints/form-attributes.js'))
.service('FormStageEndpoint', require('./services/endpoints/form-stages.js'))
.service('TagEndpoint', require('./services/endpoints/tag.js'))
.service('RoleEndpoint', require('./services/endpoints/role.js'))
.service('PermissionEndpoint', require('./services/endpoints/permission.js'))
.service('DataProviderEndpoint', require('./services/endpoints/data-providers.js'))
.service('MediaEndpoint', require('./services/endpoints/MediaEndpoint.js'))
.service('MessageEndpoint', require('./services/endpoints/message.js'))

.service('ViewHelper', require('./services/view-helper.js'))
.service('Features', require('./services/features.js'))
.service('Util', require('./services/util.js'))
.service('DataRetriever', require('./services/data-retriever.js'))
.service('Notify', require('./services/notify.js'))
.service('multiTranslate', require('./services/multi-translate.js'))
.service('GlobalFilter', require('./services/global-filter.js'))
.service('Maps', require('./services/maps.js'))
.service('Geocoding', require('./services/geocoding.js'))
.service('Languages', require('./services/languages.js'))
.service('Registration', require('./services/registration.js'))
.service('PasswordReset', require('./services/password-reset.js'))
.service('IconManager', require('./services/icon-manager.js'))
.service('FontAwesomeIcons', require('./services/endpoints/FontAwesomeIcons.js'))

.controller('navigation', require('./controllers/navigation.js'))
.controller('PageMetadata', require('./controllers/page-metadata.js'))
.controller('notifier', require('./controllers/notifier.js'))
.controller('intercom', require('./controllers/intercom.js'))

.directive('collectionSelector', require('./directives/collection-selector.js'))
.directive('collection-toggle-button', require('./directives/collection-toggle/collection-toggle-button.js'))
.directive('collection-toggle-link', require('./directives/collection-toggle/collection-toggle-link.js'))

.directive('listingToolbar', require('./directives/list-toolbar.js'))
.directive('iconPicker', require('./directives/iconpicker.js'))
.directive('colorPicker', require('./directives/color-picker.js'))
.directive('firstTimeConfig', require('./directives/first-time-config.js'))

.directive('filterSearchbar', require('./directives/filter-system/filter-searchbar.js'))
.directive('filterRole', require('./directives/filter-system/filter-role.js'))

// Event actions
.constant('EVENT', {
    ACTIONS : {
        EDIT : 'edit',
        DELETE : 'delete'
    }
})


.config(require('./configs/authentication-interceptor.js'))
.config(require('./configs/locale-config.js'))
.config(require('./configs/ui-bootstrap-template-decorators.js'))
.config(require('./configs/cache-config.js'))

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
require('./directives/custom-on-change.js');
require('./directives/file-upload.js');
require('./directives/notification-slider.js');
require('./directives/sticky-sidebar.js');
require('./directives/chart.js');
