angular.module('ushahidi.common', [
    'ushahidi.common.adaptive-input',
    'ushahidi.common.dropdown',
    'ushahidi.common.modal',
    'ushahidi.common.custom-on-change',
    'ushahidi.user-profile'
])

// Authentication
.service('Authentication', require('./auth/authentication.service.js'))
.service('Registration', require('./auth/registration.service.js'))
.service('Session', require('./auth/session.service.js'))
.service('PasswordReset', require('./auth/password-reset.service.js'))
.service('TermsOfService', require('./auth/tos.service.js'))
.service('DemoDeploymentService', require('./auth/demo-deployment.service.js'))
.directive('login', require('./auth/login.directive.js'))
.directive('register', require('./auth/register.directive.js'))
.directive('passwordReset', require('./auth/password-reset.directive.js'))
.directive('passwordResetConfirm', require('./auth/password-reset-confirm.directive.js'))
.directive('termsOfService', require('./auth/tos.directive.js'))
.directive('demoDeployment', require('./auth/demo-deployment.directive.js'))
.config(require('./auth/authentication-interceptor.config.js'))
.run(require('./auth/authentication-events.run.js'))

// Notifications
.service('Notify', require('./notifications/notify.service.js'))
.service('SliderService', require('./notifications/slider.service.js'))
.service('DemoSliderService', require('./notifications/demo-slider.service.js'))
.directive('ushSlider', require('./notifications/slider.directive.js'))
.directive('ushDemoSlider', require('./notifications/demo-slider.directive.js'))

// API Endpoint wrappers
.service('ApiKeyEndpoint', require('./services/endpoints/apikey.js'))
.service('ConfigEndpoint', require('./services/endpoints/config.js'))
.service('UserEndpoint', require('./services/endpoints/user-endpoint.js'))
.service('UserSettingsEndpoint', require('./services/endpoints/user-settings.js'))
.service('FormEndpoint', require('./services/endpoints/form.js'))
.service('FormAttributeEndpoint', require('./services/endpoints/form-attributes.js'))
.service('FormRoleEndpoint', require('./services/endpoints/form-roles.js'))
.service('FormStageEndpoint', require('./services/endpoints/form-stages.js'))
.service('FormStatsEndpoint', require('./services/endpoints/form-stats-endpoint.js'))
.service('FormContactEndpoint', require('./services/endpoints/form-contact.js'))
.service('TagEndpoint', require('./services/endpoints/tag.js'))
.service('RoleEndpoint', require('./services/endpoints/role.js'))
.service('WebhookEndpoint', require('./services/endpoints/webhooks.js'))
.service('PermissionEndpoint', require('./services/endpoints/permission.js'))
.service('DataProviderEndpoint', require('./services/endpoints/data-providers.js'))
.service('MediaEndpoint', require('./services/endpoints/MediaEndpoint.js'))
.service('MessageEndpoint', require('./services/endpoints/message.js'))
.service('PostEndpoint', require('./services/endpoints/post-endpoint.js'))
.service('PostLockEndpoint', require('./services/endpoints/post-lock-endpoint.js'))
.service('CollectionEndpoint', require('./services/endpoints/collection.js'))
.service('SavedSearchEndpoint', require('./services/endpoints/savedsearch.js'))
.service('DataImportEndpoint', require('./services/endpoints/data-import.js'))
.service('ContactEndpoint', require('./services/endpoints/contact.js'))
.service('NotificationEndpoint', require('./services/endpoints/notification.js'))
.service('TermsOfServiceEndpoint', require('./services/endpoints/terms-of-service-endpoint.js'))
.service('ExportJobEndpoint', require('./services/endpoints/export-jobs.js'))
.service('CountryCodeEndpoint', require('./services/endpoints/country-code-endpoint.js'))
.service('HxlTagEndpoint', require('./services/endpoints/hxl-tag-endpoint.js'))
.service('HxlLicenseEndpoint', require('./services/endpoints/hxl-license-endpoint.js'))
.service('HxlMetadataEndpoint', require('./services/endpoints/hxl-metadata-endpoint.js'))
.service('HxlOrganisationsEndpoint', require('./services/endpoints/hxl-organisations-endpoint.js'))
// Other services
.service('ViewHelper', require('./services/view-helper.js'))
.service('Features', require('./services/features.js'))
.service('Util', require('./services/util.js'))
.service('Maps', require('./services/maps.js'))
.service('Geocoding', require('./services/geocoding.js'))
.service('Languages', require('./services/languages.js'))
.service('IconManager', require('./services/icon-manager.js'))
.service('FontAwesomeIcons', require('./services/endpoints/FontAwesomeIcons.js'))
.service('MainsheetService', require('./services/mainsheet.service.js'))
.service('ModalService', require('./services/modal.service.js'))
.service('TranslationService', require('./services/translation.service.js'))
.controller('navigation', require('./controllers/navigation.js'))
.controller('PageMetadata', require('./controllers/page-metadata.js'))
.controller('intercom', require('./controllers/intercom.js'))
.service('LoadingProgress', require('./services/loadingProgress.service.js'))
.service('DataExport', require('./services/data-export.service.js'))
.service('HxlExport', require('./services/hxl-export.service.js'))

// Global directives
.directive('publishSelector', require('./directives/publish-selector.js'))

.directive('listingToolbar', require('./directives/list-toolbar.js'))
.directive('iconPicker', require('./directives/iconpicker.js'))

.directive('colorPicker', require('./directives/color-picker.js'))
.directive('firstTimeConfig', require('./directives/first-time-config.js'))
.directive('ushMainsheetContainer', require('./directives/mainsheet-container.directive.js'))
.directive('ushModalContainer', require('./directives/modal-container.directive.js'))
.directive('modalBody', require('./directives/modal-body.directive.js'))
.directive('layoutClass', require('./directives/layout-class.directive.js'))
.directive('embedOnly', require('./directives/embed-only.directive.js'))
.directive('ushLogo', require('./directives/ush-logo.directive.js'))
.directive('filterSearchbar', require('./directives/filter-system/filter-searchbar.js'))
.directive('filterRole', require('./directives/filter-system/filter-role.js'))
.directive('overflowToggle', require('./directives/filter-system/overflow-toggle.js'))
.directive('focus', require('./directives/focus.js'))
.directive('modeBar', require('./directives/mode-bar/mode-bar.directive.js'))
.directive('fileUpload', require('./directives/file-upload.directive.js'))
.directive('roleSelector', require('./directives/role-selector.directive.js'))
.directive('addCategory', require('./directives/add-category.directive.js'))
.directive('categorySelector', require('./directives/category-selector.directive.js'))
.directive('languageSwitch', require('./directives/language-switch.directive.js'))
.directive('loadingDots', require('./directives/loading-dots.directive.js'))

// Factories
.factory('socket', require('./factories/socket-factory.js'))
// Event actions
.constant('EVENT', {
    ACTIONS : {
        EDIT : 'edit',
        DELETE : 'delete'
    }
})
.factory('loading', require('./factories/loading.interceptor-factory.js'))
.config(require('./configs/loading.interceptor-config.js'))
.config(require('./configs/locale-config.js'))
.run(require('./configs/ui-bootstrap-template-decorators.js'))
.config(require('./configs/cache-config.js'))

.config(require('./common-routes.js'))

.run(require('./global/event-handlers.js'))
// Use language settings from config
.run(require('./global/language-settings.js'))

.run(['$templateCache', function ($templateCache) {
    $templateCache.put('common/directives/mode-bar/ushahidi-logo.html', require('./directives/mode-bar/ushahidi-logo.html'));
}])
;

// Load submodules
require('./directives/adaptive-input.js');
require('./directives/dropdown.js');
require('./directives/modal.js');
require('./directives/custom-on-change.js');
require('./user-profile/user-profile-module.js');
