module.exports = CollectionsService;

CollectionsService.$inject = ['ModalService', 'Notify', '$location', 'CollectionEndpoint'];
function CollectionsService(ModalService, Notify, $location, CollectionEndpoint) {
    return {
        showCollectionList: showCollectionList,
        showAddToCollection: showAddToCollection,
        editCollection: editCollection,
        createCollection: createCollection,
        deleteCollection: deleteCollection
    };

    function showCollectionList() {
        ModalService.openTemplate('<collection-listing toggle-mode="false"></collection-listing>', 'app.collections', 'grid-three-up', false, true, true);
    }

    function showAddToCollection(posts) {
        var scope = {
            posts: posts
        };

        ModalService.openTemplate('<collection-listing toggle-mode="true" posts="posts"></collection-listing>', 'app.edit_collection', 'grid-three-up', scope, true, true);
    }

    function editCollection(collection) {
        var scope = {
            collection: collection
        };

        ModalService.openTemplate('<collection-editor collection="collection"></collection-editor>', 'app.edit_collection', 'grid-three-up', scope, false, false);
    }

    function createCollection(posts) {
        var scope = {
            posts: posts
        };

        ModalService.openTemplate('<collection-editor posts="posts"></collection-editor>', 'app.create_collection', 'grid-three-up', scope, false, false);
    }

    function deleteCollection(collection) {
        Notify.confirm('notify.collection.delete_collection_confirm').then(function () {
            CollectionEndpoint.delete({
                collectionId: collection.id
            }).$promise.then(function () {
                $location.url('/');
            }, function (errorResponse) {
                Notify.apiErrors(errorResponse);
            });
        });
    }
}
