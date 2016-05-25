angular.module('ushahidi.common', [
    'ushahidi.common.dropdown',
    'ushahidi.common.accordion',
    'ushahidi.common.modal',
    'ushahidi.common.custom-on-change',
    'ushahidi.common.chart'
])

// Authentication
.service('Authentication', require('./auth/authentication.service.js'))
.service('Registration', require('./auth/registration.service.js'))
.service('Session', require('./auth/session.service.js'))
.service('PasswordReset', require('./auth/password-reset.service.js'))
.config(require('./auth/authentication-interceptor.config.js'))
.run(require('./auth/authentication-events.run.js'))

// Locale setup
.service('Languages', require('./language/languages.service.js'))
.config(require('./language/translate.config.js'))
// Use language settings from config
.run(require('./language/language-settings.run.js'))

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
.service('GlobalFilter', require('./services/global-filter.js'))
.service('Maps', require('./services/maps.js'))
.service('Geocoding', require('./services/geocoding.js'))
.service('ModalService', require('./services/modal.service.js'))

// Controllers
.controller('navigation', require('./controllers/navigation.js'))
.controller('PageMetadata', require('./controllers/page-metadata.js'))
.controller('intercom', require('./controllers/intercom.js'))

// Notifications
.service('Notify', require('./notifications/notify.service.js'))
.controller('notifier', require('./notifications/notifier.controller.js'))
.directive('notificationSlider', require('./notifications/notification-slider.directive.js'))

// Form components
.service('IconManager', require('./form-components/icon-manager.service.js'))
.service('FontAwesomeIcons', require('./form-components/FontAwesomeIcons.service.js'))
.directive('iconPicker', require('./form-components/iconpicker.directive.js'))
.directive('colorPicker', require('./form-components/color-picker.directive.js'))
.directive('filterSearchbar', require('./form-components/filters/filter-searchbar.directive.js'))
.directive('filterRole', require('./form-components/filters/filter-role.directive.js'))
.directive('fileUpload', require('./form-components/file-upload.directive.js'))

// Global directives
.directive('collectionSelector', require('./directives/collection-selector.js'))
.directive('listingToolbar', require('./directives/list-toolbar.js'))
.directive('ushModalContainer', require('./directives/modal-container.directive.js'))


// Event actions
.constant('EVENT', {
    ACTIONS : {
        EDIT : 'edit',
        DELETE : 'delete'
    }
})

.config(require('./configs/ui-bootstrap-template-decorators.js'))
.config(require('./configs/cache-config.js'))

.config(require('./common-routes.js'))

.run(require('./global/event-handlers.js'))
;

// Load submodules
require('./directives/dropdown.js');
require('./directives/accordion.js');
require('./directives/modal.js');
require('./directives/custom-on-change.js');
require('./directives/chart.js');
