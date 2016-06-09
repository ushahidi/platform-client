angular.module('ushahidi.common', [
    'ushahidi.common.adaptive-input',
    'ushahidi.common.dropdown',
    'ushahidi.common.accordion',
    'ushahidi.common.offcanvas',
    'ushahidi.common.modal',
    'ushahidi.common.custom-on-change',
    'ushahidi.common.file-upload',
    'ushahidi.common.sticky-sidebar'
])

// Authentication
.service('Authentication', require('./auth/authentication.service.js'))
.service('Registration', require('./auth/registration.service.js'))
.service('Session', require('./auth/session.service.js'))
.service('PasswordReset', require('./auth/password-reset.service.js'))
.directive('login', require('./auth/login.directive.js'))
.directive('register', require('./auth/register.directive.js'))
.directive('passwordReset', require('./auth/password-reset.directive.js'))
.directive('passwordResetConfirm', require('./auth/password-reset-confirm.directive.js'))
.config(require('./auth/authentication-interceptor.config.js'))
.run(require('./auth/authentication-events.run.js'))

// Notifications
.service('Notify', require('./notifications/notify.service.js'))
.service('SliderService', require('./notifications/slider.service.js'))
.directive('ushSlider', require('./notifications/slider.directive.js'))

// API Endpoint wrappers
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

// Other services
.service('ViewHelper', require('./services/view-helper.js'))
.service('Features', require('./services/features.js'))
.service('Util', require('./services/util.js'))
.service('DataRetriever', require('./services/data-retriever.js'))
.service('multiTranslate', require('./services/multi-translate.js'))
.service('GlobalFilter', require('./services/global-filter.js'))
.service('Maps', require('./services/maps.js'))
.service('Geocoding', require('./services/geocoding.js'))
.service('Languages', require('./services/languages.js'))
.service('IconManager', require('./services/icon-manager.js'))
.service('FontAwesomeIcons', require('./services/endpoints/FontAwesomeIcons.js'))
.service('ModalService', require('./services/modal.service.js'))

// Controllers
.controller('navigation', require('./controllers/navigation.js'))
.controller('PageMetadata', require('./controllers/page-metadata.js'))
.controller('intercom', require('./controllers/intercom.js'))

// Global directives
.directive('publishSelector', require('./directives/publish-selector.js'))

.directive('collectionSelector', require('./directives/collection-selector.js'))
.directive('collectionToggleButton', require('./directives/collection-toggle/collection-toggle-button.js'))
.directive('collectionToggleLink', require('./directives/collection-toggle/collection-toggle-link.js'))

.directive('listingToolbar', require('./directives/list-toolbar.js'))
.directive('iconPicker', require('./directives/iconpicker.js'))

.directive('colorPicker', require('./directives/color-picker.js'))
.directive('firstTimeConfig', require('./directives/first-time-config.js'))
.directive('ushModalContainer', require('./directives/modal-container.directive.js'))
.directive('modalBody', require('./directives/modal-body.directive.js'))
.directive('layoutClass', require('./directives/layout-class.directive.js'))

.directive('filterSearchbar', require('./directives/filter-system/filter-searchbar.js'))
.directive('filterRole', require('./directives/filter-system/filter-role.js'))
.directive('overflowToggle', require('./directives/filter-system/overflow-toggle.js'))

// Event actions
.constant('EVENT', {
    ACTIONS : {
        EDIT : 'edit',
        DELETE : 'delete'
    }
})

.config(require('./configs/locale-config.js'))
.config(require('./configs/ui-bootstrap-template-decorators.js'))
.config(require('./configs/cache-config.js'))

.config(require('./common-routes.js'))

.run(require('./global/event-handlers.js'))
// Use language settings from config
.run(require('./global/language-settings.js'))
;

// Load submodules
require('./directives/adaptive-input.js');
require('./directives/dropdown.js');
require('./directives/accordion.js');
require('./directives/offcanvas.js');
require('./directives/modal.js');
require('./directives/custom-on-change.js');
require('./directives/file-upload.js');
require('./directives/sticky-sidebar.js');
