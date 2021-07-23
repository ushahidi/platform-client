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

// Detail Screen
.directive('postMessages', require('./post-detail/post-messages.directive.js'))
.directive('postAddForm', require('./post-detail/post-add-form.directive.js'))
.directive('postValue', require('./post-detail/post-value.directive.js'))
.directive('postMediaValue', require('./post-detail/post-media-value.directive.js'))
.directive('postVideoView', require('./post-detail/post-video-value.directive.js'))
.directive('postDetailMap', require('./post-detail/map.directive.js'))
.directive('postDetailData', require('./post-detail/post-detail-data.directive.js'))
.directive('postCategoryValue', require('./post-detail/post-category-value.directive.js'))

// Create / Edit Screens
.service('PostEntity', require('./post-edit/post-entity.service.js'))
.service('PostEditService', require('./post-edit/post-edit.service.js'))
.service('MediaEditService', require('./post-edit/media-edit.service.js'))
.directive('postMedia', require('./post-edit/post-media.directive.js'))
.directive('postVideoInput', require('./post-edit/post-video.directive.js'))
.directive('postDatetime', require('./post-edit/post-datetime-value.directive.js'))
.directive('postLocation', require('./post-edit/location.directive.js'))
.directive('postRelation', require('./post-edit/post-relation.directive.js'))

// Post editing workflows
.directive('postEditor', require('./post-edit/post-editor.directive.js'))
.directive('postValueEdit', require('./post-edit/post-value-edit.directive.js'))
.directive('postCategoryEditor', require('./post-edit/post-category-editor.js'))
.directive('postTabs', require('./post-edit/post-tabs.directive.js'))
.directive('postToolbox', require('./post-edit/post-toolbox.directive.js'))
.directive('postDataEditor', require('./post-edit/post-data-editor.directive.js'))
.directive('postTranslationEditor', require('./post-edit/post-translation-editor.directive.js'))

// Shared directives + services
.service('PostSurveyService', require('./no-groups-yet/post-survey.service.js'))

// Post Locking
.service('PostLockService', require('./no-groups-yet/post-lock.service.js'))
.directive('postLock', require('./no-groups-yet/post-lock.directive.js'))

// Post editing workflows
.directive('surveyLanguageSelector', require('./no-groups-yet/survey-language-selector.directive.js'))

.directive('collectionToggleButton', require('./no-groups-yet/collection-toggle/collection-toggle-button.js'))

.config(require('./data-routes.js'))