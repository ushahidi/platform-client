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
.directive('postTranslationEditor', require('./data-view-right/post-edit/post-translation-editor.directive.js'))

// Create / Edit Screens
.service('PostEntity', require('./edit-create/not-grouped-yet/post-entity.service.js'))
.service('PostEditService', require('./edit-create/not-grouped-yet/post-edit.service.js'))
.service('MediaEditService', require('./edit-create/media-edit.service.js'))
.directive('postMedia', require('./edit-create/post-media.directive.js'))
.directive('postVideoInput', require('./edit-create/post-video.directive.js'))
.directive('postDatetime', require('./edit-create/post-datetime-value.directive.js'))
.directive('postLocation', require('./edit-create/location.directive.js'))
.directive('postRelation', require('./edit-create/post-relation.directive.js'))

// Post Create
.directive('postEditor', require('./post-create/post-editor.directive.js'))

// Post editing workflows
.directive('postValueEdit', require('./edit-create/post-value-edit.directive.js'))
.directive('postCategoryEditor', require('./edit-create/post-category-editor.js'))
.directive('postTabs', require('./edit-create/post-tabs.directive.js'))

// Shared directives + services
.service('PostSurveyService', require('./no-groups-yet/post-survey.service.js'))

// Post editing workflows
.directive('surveyLanguageSelector', require('./no-groups-yet/survey-language-selector.directive.js'))

.directive('collectionToggleButton', require('./collection-toggle/collection-toggle-button.js'))

.config(require('./data-routes.js'))