module.exports = CollectionListing;

CollectionListing.$inject = [];

function CollectionListing() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            'isToggleMode': '<toggleMode',
            'posts': '='
        },
        controller: CollectionListingController,
        template: require('./listing.html')
    };
}

CollectionListingController.$inject = [
    '$rootScope',
    '$scope',
    '$translate',
    '$location',
    '$q',
    'Notify',
    'CollectionEndpoint',
    '_',
    'CollectionsService'
];
function CollectionListingController(
    $rootScope,
    $scope,
    $translate,
    $location,
    $q,
    Notify,
    CollectionEndpoint,
    _,
    CollectionsService
) {
    var collectionsPath = '/collections/';

    $scope.postInCollection = postInCollection;
    $scope.toggleCollection = toggleCollection;
    $scope.addToPostsSet = addToPostsSet;
    $scope.collectionClickHandler = collectionClickHandler;
    $scope.createNewCollection = createNewCollection;
    $scope.searchCollections = loadCollections;
    $scope.currentUser = $rootScope.currentUser;

    activate();

    function activate() {
        loadCollections();
    }

    function loadCollections(collectionQuery) {
        if ($scope.isToggleMode) {
            $scope.collections = CollectionEndpoint.editableByMe({ q: collectionQuery });
        } else {
            $scope.collections = CollectionEndpoint.query({ q: collectionQuery });
        }
    }

    function postInCollection(collection) {
        // If we are dealing with a single model we want to mark
        // all collections it exists in as checked
        // If we are dealing with multiple posts the user
        // does not have the option to remove posts from collections only to add

        // TODO figure out to set newly created checkbox checked once it's been addToCollection
        return $scope.posts.length === 1 ? _.contains($scope.posts[0].sets, String(collection.id)) : false;
    }

    // Update post set with collection(s) it has been added to
    function addToPostsSet(collectionId) {
        _.each($scope.posts, function (post) {
            post.sets.push(collectionId);
        });
    }

    // Add the post(s) to a given collection
    function addToCollection(selectedCollection) {
        var collectionId = selectedCollection.id, collection = selectedCollection.name;
        var calls = [];
        // Create collection update calls for all posts
        // TODO: allow many to one update for posts to collection
        // on api
        _.each($scope.posts, function (post) {
            calls.push(
                CollectionEndpoint.addPost({'collectionId': collectionId, 'id': post.id})
            );
        });
        $q.all(calls)
            .then(function () {
                // Update the posts sets
                $scope.addToPostsSet(String(collectionId));
                Notify.notify('notify.collection.add_to_collection', {collection: collection});
            }, function (errorResponse) {
                Notify.apiErrors(errorResponse);
            });
    }

    // Remove post(s) from a given collection
    function removeFromCollection(selectedCollection) {
        var collectionId = selectedCollection.id, collection = selectedCollection.name;
        var calls = [];
        _.each($scope.posts, function (post) {
            calls.push(
                CollectionEndpoint.removePost({'collectionId': collectionId, 'id': post.id})
            );
        });
        $q.all(calls)
        .then(function () {
            _.each($scope.posts, function (post) {
                post.sets = _.without(post.sets, String(collectionId));
            });
            Notify.notify('notify.collection.removed_from_collection', {collection: collection});
        }, function (errorResponse) {
            Notify.apiErrors(errorResponse);
        });
    }

    // Handle behaviour of the collection listing item click
    // In Listing mode: a click will take the user to the collections page
    // In Toggle mode: a click will select a given collection
    function collectionClickHandler(collection) {
        $scope.isToggleMode ? toggleCollection(collection) : goToCollection(collection);
    }

    // This feature is only available in Lisiting mode
    // When a user clicks on a collection lisiting item
    // they will be directed to the collection page
    function goToCollection(collection) {
        $scope.$parent.closeModal();
        $location.path(collectionsPath + collection.id + '/' + collection.view);
    }

    // Toggle a post as selected or not
    // This behaviour is specific to the Toggle mode of collection listing
    // It allows a user to select a collection by clicking on the whole row
    function toggleCollection(selectedCollection) {
        // If we are dealing with a single post the user can add and remove from collection
        // For mass updates of many post the user is only permitted to add to collection
        if ($scope.posts.length === 1) {
            if (_.contains($scope.posts[0].sets, String(selectedCollection.id))) {
                removeFromCollection(selectedCollection);
            } else {
                addToCollection(selectedCollection);
            }
        } else {
            addToCollection(selectedCollection);
        }
    }

    // This function passes flow control to the Collection Creation modal
    // In Toggle mode: we expect the creation editor to return control to the Listing directive
    // In the toggleMode we attach the post(s) to the event, collectionEditor will return this post(s)
    // after the creation, along with the newly created collection
    function createNewCollection() {
        $scope.$parent.closeModal();
        CollectionsService.createCollection($scope.posts);
    }
}
