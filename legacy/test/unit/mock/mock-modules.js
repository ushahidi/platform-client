angular
    .module('ushahidi.mock', [])
    .provider('$translate', require('./services/translate.js'))
    .service('Leaflet', require('./services/third_party/leaflet.js'))
    .service('$transitions', require('./services/third_party/transitions.js'))

    .service('PostEndpoint', require('./services/post.js'))
    .service('FormEndpoint', require('./services/form.js'))
    .service('FormRoleEndpoint', require('./services/form-role.js'))
    .service('FormStageEndpoint', require('./services/form-stages.js'))
    .service('FormAttributeEndpoint', require('./services/form-attributes.js'))
    .service('FormStatsEndpoint', require('./services/form-stats-endpoint.js'))
    .service('FormContactEndpoint', require('./services/form-contact.js'))
    .service('TagEndpoint', require('./services/tag.js'))
    .service('NotificationEndpoint', require('./services/notification.js'))
    .service('MessageEndpoint', require('./services/message.js'))
    .service('SavedSearchEndpoint', require('./services/savedsearch.js'))
    .service('UserEndpoint', require('./services/user.js'))
    .service('UserSettingsEndpoint', require('./services/user-settings.js'))
    .service('CollectionEndpoint', require('./services/collection.js'))
    .service('ContactEndpoint', require('./services/contact.js'))
    .service('ConfigEndpoint', require('./services/config.js'))
    .service('RoleEndpoint', require('./services/role.js'))
    .service('PermissionEndpoint', require('./services/permission.js'))
    .service('DataProviderEndpoint', require('./services/data-provider.js'))
    .service('DataImportEndpoint', require('./services/data-import.js'))
    .service('DataRetriever', require('./services/data-retriever.js'))
    .service('MediaEndpoint', require('./services/media.js'))
    .service('PostLockEndpoint', require('./services/post-lock-endpoint.js'))
    .service('PostLockService', require('./services/post-lock.service.js'))
    .service('HxlExport', require('./services/hxl-export.js'))
    .service(
        'CountryCodeEndpoint',
        require('./services/country-code-endpoint.js')
    )
    .service('Features', require('./services/features.js'))
    .service('Authentication', require('./services/authentication.js'))
    .service('Session', require('./services/session.js'))
    .service('GlobalFilter', require('./services/global-filters.js'))
    .service('PostFilters', require('./services/post-filters.js'))
    .service('Maps', require('./services/maps.js'))
    .service('ModalService', require('./services/modal.service.js'))
    .service(
        'PostActionsService',
        require('./services/post-actions-service.js')
    )
    .service('PostEditService', require('./services/post-edit-service.js'))
    .service('PostViewService', require('./services/post-view-service.js'))
    .service(
        'PostMetadataService',
        require('./services/post-metadata-service.js')
    )
    .service('MediaEditService', require('./services/media-edit-service.js'))
    .service('Notify', require('./services/notify.js'))
    .service('SurveyNotify', require('./services/survey-notify.js'))
    .service('ImportNotify', require('./services/importnotify.js'))
    .service('PostSurveyService', require('./services/post-survey-service.js'))
    .service('Languages', require('./services/languages.js'))
    .service('TranslationService', require('./services/translation-service.js'))
    .service(
        'LoadingProgress',
        require('./services/loadingProgress.service.js')
    )
    .service('DataExport', require('./services/data-export.js'))
    .service('DataImport', require('./services/data-export.js'))
    .value('translateFilter', function (value) {
        return value;
    })
    .service('SurveysSdk', require('./services/sdk/SurveysSdk.js'))
    .service('CategoriesSdk', require('./services/sdk/CategoriesSdk.js'))
    .service('UtilsSdk', require('./services/sdk/UtilsSdk.js'))
    .service('PostsSdk', require('./services/sdk/PostsSdk.js'))
    .service(
        'AccessibilityService',
        require('./services/accessibility.service')
    )

    .controller(
        'navigation',
        require('./controllers/navigation.controller.mock.js')
    )
    .factory('socket', require('./factories/socket-factory.mock.js'));
