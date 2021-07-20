angular.module('ushahidi.posts', [])

// Detail Screen
.directive('postMessages', require('./detail/post-messages.directive.js'))
.directive('postAddForm', require('./detail/post-add-form.directive.js'))
.directive('postValue', require('./detail/post-value.directive.js'))
.directive('postMediaValue', require('./detail/post-media-value.directive.js'))
.directive('postVideoView', require('./detail/post-video-value.directive.js'))
.directive('postDetailMap', require('./detail/map.directive.js'))
.directive('postDetailData', require('./detail/post-detail-data.directive.js'))
.directive('postCategoryValue', require('./detail/post-category-value.directive.js'))

// Create / Edit Screens
.service('PostEntity', require('./modify/post-entity.service.js'))
.service('PostEditService', require('./modify/post-edit.service.js'))
.service('MediaEditService', require('./modify/media-edit.service.js'))
.directive('postMedia', require('./modify/post-media.directive.js'))
.directive('postVideoInput', require('./modify/post-video.directive.js'))
.directive('postDatetime', require('./modify/post-datetime-value.directive.js'))
.directive('postLocation', require('./modify/location.directive.js'))
.directive('postRelation', require('./modify/post-relation.directive.js'))

// Post editing workflows
.directive('postEditor', require('./modify/post-editor.directive.js'))
.directive('postValueEdit', require('./modify/post-value-edit.directive.js'))
.directive('postCategoryEditor', require('./modify/post-category-editor.js'))
.directive('postTabs', require('./modify/post-tabs.directive.js'))
.directive('postToolbox', require('./modify/post-toolbox.directive.js'))
.directive('postDataEditor', require('./modify/post-data-editor.directive.js'))
.directive('postTranslationEditor', require('./modify/post-translation-editor.directive.js'))
// Timeline, data and Map screen
.service('PostViewService', require('./views/post-view.service.js'))
// @todo move elsewhere? Used in post-view and activity
.directive('postViewUnavailable', require('./views/post-view-unavailable.directive.js'))


.directive('savedSearchEditor', require('./savedsearches/editor-directive.js'))
.directive('savedSearchCreate', require('./savedsearches/create-directive.js'))
.directive('savedSearchUpdate', require('./savedsearches/update-directive.js'))
.directive('savedSearchModal', require('./savedsearches/saved-search-modal.directive.js'))
.directive('savedSearchListEditorModal', require('./savedsearches/saved-search-list-editor-modal.directive.js'))

.directive('savedSearchModeContext', require('./savedsearches/mode-context.directive.js'))

.service('CollectionsService', require('./collections/collections.service.js'))
.directive('collectionModeContext', require('./collections/mode-context.directive.js'))
.directive('collectionEditor', require('./collections/editor.directive.js'))
.directive('collectionListing', require('./collections/listing.directive.js'))

.config(require('./posts-routes.js'))

.run(['Leaflet', function (L) {
    L.Icon.Default.imagePath = '/img';
}])
;
