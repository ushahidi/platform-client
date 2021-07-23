angular.module('ushahidi.data', [])

// Post-view-data
.directive('postViewData', require('./post-view-data.directive.js'))

// Post Detail
.directive('postDetailData', require('./data-view-right/post-detail/post-detail-data.directive.js'))
.directive('postDetailMap', require('./data-view-right/post-detail/map.directive.js'))
.directive('postCategoryValue', require('./data-view-right/post-detail/post-category-value.directive.js'))
.directive('postMediaValue', require('./data-view-right/post-detail/post-media-value.directive.js'))
.directive('postValue', require('./data-view-right/post-detail/post-value.directive.js'))
.directive('postVideoView', require('./data-view-right/post-detail/post-video-value.directive.js'))
.directive('postAddForm', require('./data-view-right/post-detail/post-add-form.directive.js'))
.directive('postMessages', require('./data-view-right/post-messages.directive.js'))
// Post Locking
.service('PostLockService', require('./data-view-right/post-detail/post-lock.service.js'))
.directive('postLock', require('./data-view-right/post-detail/post-lock.directive.js'))

// Post Edit
.directive('postToolbox', require('./data-view-right/post-edit/post-toolbox.directive.js'))
.directive('postDataEditor', require('./data-view-right/post-edit/post-data-editor.directive.js'))

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
.directive('postTranslationEditor', require('./split-into-post-edit-and-create/post-translation-editor.directive.js'))

// Shared directives + services
.service('PostSurveyService', require('./no-groups-yet/post-survey.service.js'))

// Post editing workflows
.directive('surveyLanguageSelector', require('./no-groups-yet/survey-language-selector.directive.js'))

.directive('collectionToggleButton', require('./collection-toggle/collection-toggle-button.js'))

.config(require('./data-routes.js'))