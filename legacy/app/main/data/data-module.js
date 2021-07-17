angular.module('ushahidi.data', [])

// Shared directives + services
.directive('postActions', require('./common/post-actions.directive.js'))
.directive('postMetadata', require('./common/post-metadata.directive.js'))
.service('PostMetadataService', require('./common/post-metadata.service.js'))
.service('PostSurveyService', require('./common/post-survey.service.js'))

// Post Locking
.service('PostLockService', require('./common/post-lock.service.js'))
.directive('postLock', require('./common/post-lock.directive.js'))

// Detail Screen
.service('PostActionsService', require('./common/post-actions.service.js'))

// Post editing workflows
.directive('surveyLanguageSelector', require('./common/survey-language-selector.directive.js'))

// Timeline, data and Map screen
.directive('postCard', require('./views/post-card.directive.js'))
.directive('postPreviewMedia', require('./views/post-preview-media.directive.js'))
.directive('postViewData', require('./views/post-view-data.directive.js'))

.directive('collectionToggleButton', require('./common/collection-toggle/collection-toggle-button.js'))
.directive('collectionToggleLink', require('./common/collection-toggle/collection-toggle-link.js'))

.config(require('./data-routes.js'))