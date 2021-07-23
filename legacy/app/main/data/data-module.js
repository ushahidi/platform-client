angular.module('ushahidi.data', [])

// Post-view-data
.directive('postViewData', require('./post-view-data.directive.js'))

// Post card related
.directive('postCard', require('./post-card/post-card.directive.js'))
.directive('postPreviewMedia', require('./post-card/post-preview-media.directive.js'))
.directive('postActions', require('./post-card/post-actions.directive.js'))
.service('PostActionsService', require('./post-card/post-actions.service.js'))
.directive('postMetadata', require('./post-card/post-metadata.directive.js'))
.service('PostMetadataService', require('./post-card/post-metadata.service.js'))
.directive('collectionToggleLink', require('./post-card/collection-toggle/collection-toggle-link.js'))

// Shared directives + services
.service('PostSurveyService', require('./no-groups-yet/post-survey.service.js'))

// Post Locking
.service('PostLockService', require('./no-groups-yet/post-lock.service.js'))
.directive('postLock', require('./no-groups-yet/post-lock.directive.js'))

// Post editing workflows
.directive('surveyLanguageSelector', require('./no-groups-yet/survey-language-selector.directive.js'))

.directive('collectionToggleButton', require('./no-groups-yet/collection-toggle/collection-toggle-button.js'))

.config(require('./data-routes.js'))