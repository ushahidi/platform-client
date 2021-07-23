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
// Post Locking
.service('PostLockService', require('./post-detail/post-lock.service.js'))
.directive('postLock', require('./post-detail/post-lock.directive.js'))

// Create / Edit Screens
.service('PostEntity', require('./split-into-post-edit-and-create/post-entity.service.js'))
.service('PostEditService', require('./split-into-post-edit-and-create/post-edit.service.js'))
.service('MediaEditService', require('./split-into-post-edit-and-create/media-edit.service.js'))
.directive('postMedia', require('./split-into-post-edit-and-create/post-media.directive.js'))
.directive('postVideoInput', require('./split-into-post-edit-and-create/post-video.directive.js'))
.directive('postDatetime', require('./split-into-post-edit-and-create/post-datetime-value.directive.js'))
.directive('postLocation', require('./split-into-post-edit-and-create/location.directive.js'))
.directive('postRelation', require('./split-into-post-edit-and-create/post-relation.directive.js'))

// Post editing workflows
.directive('postEditor', require('./split-into-post-edit-and-create/post-editor.directive.js'))
.directive('postValueEdit', require('./split-into-post-edit-and-create/post-value-edit.directive.js'))
.directive('postCategoryEditor', require('./split-into-post-edit-and-create/post-category-editor.js'))
.directive('postTabs', require('./split-into-post-edit-and-create/post-tabs.directive.js'))
.directive('postToolbox', require('./split-into-post-edit-and-create/post-toolbox.directive.js'))
.directive('postDataEditor', require('./split-into-post-edit-and-create/post-data-editor.directive.js'))
.directive('postTranslationEditor', require('./split-into-post-edit-and-create/post-translation-editor.directive.js'))

// Shared directives + services
.service('PostSurveyService', require('./no-groups-yet/post-survey.service.js'))

// Post editing workflows
.directive('surveyLanguageSelector', require('./no-groups-yet/survey-language-selector.directive.js'))

.directive('collectionToggleButton', require('./no-groups-yet/collection-toggle/collection-toggle-button.js'))

.config(require('./data-routes.js'))