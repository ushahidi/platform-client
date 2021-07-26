export const DATA_MODULE = angular.module('ushahidi.data', [])

// Post-view-data
.directive('postViewData', require('./post-view-data.directive.js'))

// Post Detail
.directive('postDetailData', require('./post-detail/post-detail-data.directive.js'))
.directive('postDetailMap', require('./post-detail/map.directive.js'))
.directive('postCategoryValue', require('./post-detail/post-category-value.directive.js'))
.directive('postMediaValue', require('./post-detail/post-media-value.directive.js'))
.directive('postValue', require('./post-detail/post-value.directive.js'))
.directive('postVideoView', require('./post-detail/post-video-value.directive.js'))
.directive('postAddForm', require('./post-detail/post-add-form.directive.js'))
// Post Locking
.service('PostLockService', require('./post-detail/post-lock.service.js'))
.directive('postLock', require('./post-detail/post-lock.directive.js'))

// Post Edit
.directive('postToolbox', require('./post-edit/post-toolbox.directive.js'))
.directive('postDataEditor', require('./post-edit/post-data-editor.directive.js'))
.directive('postTranslationEditor', require('./post-edit/post-translation-editor.directive.js'))

// Post Create
.directive('postEditor', require('./post-create/post-editor.directive.js'))

// Common (edit, detail and or create)
.directive('postMessages', require('./common/post-edit-detail/post-messages.directive.js'))
.service('MediaEditService', require('./common/post-edit-create/media-edit.service.js'))
.directive('postMedia', require('./common/post-edit-create/post-media.directive.js'))
.directive('postVideoInput', require('./common/post-edit-create/post-video.directive.js'))
.directive('postDatetime', require('./common/post-edit-create/post-datetime-value.directive.js'))
.directive('postLocation', require('./common/post-edit-create/location.directive.js'))
.directive('postRelation', require('./common/post-edit-create/post-relation.directive.js'))
.directive('postValueEdit', require('./common/post-edit-create/post-value-edit.directive.js'))
.directive('postCategoryEditor', require('./common/post-edit-create/post-category-editor.js'))
.directive('postTabs', require('./common/post-edit-create/post-tabs.directive.js'))
.directive('surveyLanguageSelector', require('./common/post-edit-detail-create/survey-language-selector.directive.js'))
.service('PostEntity', require('./common/post-edit-detail-create/post-entity.service.js'))

// Collection toggle button
.directive('collectionToggleButton', require('./collection-toggle/collection-toggle-button.js'))

// Not yet grouped
.service('PostEditService', require('./not-grouped-yet/post-edit.service.js'))
.service('PostSurveyService', require('./not-grouped-yet/post-survey.service.js'))
