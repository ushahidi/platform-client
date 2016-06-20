module.exports = CollectionListing;

CollectionListing.$inject = [];

function CollectionListing() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
        },
        controller: CollectionListingController,
        templateUrl: 'templates/sets/collections/collection-listing.html'
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
    '_'
];
function CollectionListingController(
    $rootScope,
    $scope,
    $translate,
    $location,
    $q,
    Notify,
    CollectionEndpoint,
    _
) {
    $scope.collectionListingVisible = false;
    $scope.path = '/collections/';
    $scope.isToggleMode = false;

    $scope.loadCollections = loadCollections;
    $scope.postInCollection = postInCollection;
    $scope.toggleCollection = toggleCollection;
    $scope.addToPostsSet = addToPostsSet;
    $scope.addToCollection = addToCollection;
    $scope.removeFromCollection = removeFromCollection;
    $scope.collectionClickHandler = collectionClickHandler;
    $scope.goToCollection = goToCollection;
    $scope.createNewCollection = createNewCollection;
    $scope.searchCollections = searchCollections;

    activate();

    function activate() {

    }

    function loadCollections() {
        if ($scope.isToggleMode) {
            $scope.collections = CollectionEndpoint.editableByMe();
        } else {
            $scope.collections = CollectionEndpoint.query();
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

        CollectionEndpoint.removePost({'collectionId': collectionId, 'id': $scope.post.id})
        .$promise
        .then(function () {
            $scope.post.sets = _.without($scope.post.sets, String(collectionId));
            Notify.notify('notify.collection.removed_from_collection', {collection: collection});
        }, function (errorResponse) {
            Notify.apiErrors(errorResponse);
        });
    }

    // Handle behaviour of the collection listing item click
    // In Listing mode: a click will take the user to the collections page
    // In Toggle mode: a click will select a given collection
    function collectionClickHandler(collection) {
        $scope.isToggleMode ? $scope.toggleCollection(collection.id) : $scope.goToCollection(collection);
    }

    // This feature is only available in Lisiting mode
    // When a user clicks on a collection lisiting item
    // they will be directed to the collection page
    function goToCollection(collection) {
        $scope.collectionListingVisible = false;
        $location.path($scope.path + collection.id + '/' + collection.view);
    }

    // Toggle a post as selected or not
    // This behaviour is specific to the Toggle mode of collection listing
    // It allows a user to select a collection by clicking on the whole row
    function toggleCollection(selectedCollection) {
        // If we are dealing with a single post the user can add and remove from collection
        // For mass updates of many post the user is only permitted to add to collection
        if ($scope.posts.length === 1) {
            if (_.contains($scope.posts[0].sets, String(selectedCollection.id))) {
                $scope.removeFromCollection(selectedCollection);
            } else {
                $scope.addToCollection(selectedCollection);
            }
        } else {
            $scope.addToCollection(selectedCollection);
        }
    }

    // This function passes flow control to the Collection Creation modal
    // In Toggle mode: we expect the creation editor to return control to the Listing directive
    // In the toggleMode we attach the post(s) to the event, collectionEditor will return this post(s)
    // after the creation, along with the newly created collection
    function createNewCollection() {
        $scope.collectionListingVisible = false;
        $scope.isToggleMode ? $rootScope.$emit('collectionCreate:show', $scope.posts) : $rootScope.$emit('collectionEditor:show');
    }

    // Search and filter collection list by query term
    function searchCollections(collectionQuery) {
        $scope.collections = CollectionEndpoint.editableByMe(
            {
                q: collectionQuery
            }
        );
    }

    // Update collection listing when collection are updated elsewhere
    // in the app
    $rootScope.$on('collection:update', function () {
        $scope.loadCollections();
    });

    // Show listing modal
    $rootScope.$on('collectionListing:show', function () {
        $scope.collectionListingVisible = true;
        $scope.isToggleMode = false;
        $scope.loadCollections();
    });

    // Show listing modal in Collection Toggle mode
    // This allows users to select collection to add a given post(s) to
    // This is called with a post array of 1 or more entries
    $rootScope.$on('collectionToggle:show', function (event, posts) {
        $scope.posts = posts;
        $scope.collectionListingVisible = true;
        $scope.isToggleMode = true;
        $scope.loadCollections();
    });

    // Show listing modal Collection Toggle mode
    // This occurs post creation of a new collection
    // The event expects the post(s) which should be added to the collection
    // and the newly created collection
    $rootScope.$on('collectionToggle:show:afterCreate', function (event, posts, collection) {
        // Get posts back so that collection listing modal does not have to maintain state
        $scope.posts = posts;
        // Add posts to the newly created collection
        $scope.addToCollection(collection);
        // Show the modal
        $scope.collectionListingVisible = true;
        // Set the modal to toggle modal
        $scope.isToggleMode = true;
        // Refresh the collections to ensure the list is up todate
        $scope.loadCollections();
    });
}
