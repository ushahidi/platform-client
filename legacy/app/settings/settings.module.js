export const SETTINGS_MODULE = angular.module('ushahidi.settings', [])

    .directive(
        'afterImportCsv',
        require('./data-import/data-after-import.directive.js')
    )
    .directive('importerCsv', require('./data-import/data-import.directive.js'))
    .directive('hdxDetails', require('./data-export/hdx-details.directive.js'))
    .directive('gmailAuth', require('./datasources/gmail-auth.directive.js'))
    .directive('surveyEditor', require('./surveys/survey-editor.directive.js'))
    .directive(
        'surveyTranslationEditor',
        require('./surveys/survey-translation-editor.directive.js')
    )
    .directive(
        'fieldTranslationEditor',
        require('./surveys/field-translation-editor.directive.js')
    )
    .directive(
        'surveyTaskCreate',
        require('./surveys/task-create.directive.js')
    )
    .directive(
        'surveyAttributeCreate',
        require('./surveys/attribute-create.directive.js')
    )
    .directive(
        'surveyAttributeEditor',
        require('./surveys/attribute-editor.directive.js')
    )
    .service('SurveyNotify', require('./surveys/survey.notify.service.js'))
    .directive(
        'targetedQuestion',
        require('./surveys/targeted-surveys/targeted-question.directive.js')
    )
    .directive('settingsMap', require('./site/map.directive.js'))
    .directive('settingsEditor', require('./site/editor.directive.js'))
    .directive(
        'categoryTranslationEditor',
        require('./categories/category-translation-editor.directive.js')
    )
    .directive('filterUsers', require('./users/filter-users.directive.js'))

    .directive('customRoles', require('./roles/roles.directive.js'))
    .directive('customRolesEditor', require('./roles/editor.directive.js'))

    .directive('customWebhooks', require('./webhooks/webhooks.directive.js'))
    .directive(
        'customWebhooksEditor',
        require('./webhooks/editor.directive.js')
    )
    .directive('setupDonation', require('./donation/donation.directive.js'))

    //Api services and endpoint wrappers from common module
    .service('ApiKeyEndpoint', require('./services/endpoints/apikey.js'))
    .service('UserSettingsEndpoint', require('./services/endpoints/user-settings.js'))
    .service('FormRoleEndpoint', require('./services/endpoints/form-roles.js'))
    .service('FormStageEndpoint', require('./services/endpoints/form-stages.js'))
    .service('FormContactEndpoint', require('./services/endpoints/form-contact.js'))
    .service('WebhookEndpoint', require('./services/endpoints/webhooks.js'))
    .service('PermissionEndpoint', require('./services/endpoints/permission.js'))
    .service('DataProviderEndpoint', require('./services/endpoints/data-providers.js'))
    .service('CountryCodeEndpoint', require('./services/endpoints/country-code-endpoint.js'))
    .service('HxlLicenseEndpoint', require('./services/endpoints/hxl-license-endpoint.js'))
    .service('HxlMetadataEndpoint', require('./services/endpoints/hxl-metadata-endpoint.js'))
    .service('HxlOrganisationsEndpoint', require('./services/endpoints/hxl-organisations-endpoint.js'))
    .service('AccessibilityService', require('./services/accessibility.service.js'))
    .service('HxlExport', require('./services/hxl-export.service.js'))
    .config(require('./settings-list.routes.js'))

//From common module
    .directive('loadingDots', require('./directives/loading-dots.directive.js'))
    .directive(
        'categorySelector',
        require('./directives/category-selector.directive.js')
    )
    .directive(
        'filterSearchbar',
        require('./directives/filter-system/filter-searchbar.js')
    )
    .directive(
        'filterRole',
        require('./directives/filter-system/filter-role.js')
    )
    .directive('colorPicker', require('./directives/color-picker.js'))
