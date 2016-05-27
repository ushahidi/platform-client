module.exports = [
    '$rootScope',
    '$translate',
    '$location',
    '$q',
    'Notify',
    'CollectionEndpoint',
    '_',
function (
    $rootScope,
    $translate,
    $location,
    $q,
    Notify,
    CollectionEndpoint,
    _
) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
        },
        link: function ($scope, $element, $attrs, ngModel) {

            $scope.collectionListingVisible = false;
            $scope.path = '/collections/';
            $scope.isToggleMode = false;

            $scope.loadCollections = function () {
                $scope.collections = CollectionEndpoint.editableByMe();
            };

            $scope.postInCollection = function (collection) {
                return $scope.posts.length === 1 ? _.contains($scope.posts[0].sets, String(collection.id)) : false;
            };

            $scope.toggleCollection = function (selectedCollection) {
                if ($scope.posts.length === 1) {
                    if (_.contains($scope.posts[0].sets, String(selectedCollection.id))) {
                        $scope.removeFromCollection(selectedCollection);
                    } else {
                        $scope.addToCollection(selectedCollection);
                    }
                } else {
                    $scope.addToCollection(selectedCollection);
                }
            };

            $scope.addToPostsSet = function (collectionId) {
                _.each($scope.posts, function (post) {
                    post.sets.push(collectionId);
                });
            };

            $scope.addToCollection = function (selectedCollection) {
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
                        $translate('notify.collection.add_to_collection', {collection: collection})
                        .then(function (message) {
                            // Update the posts sets
                            $scope.addToPostsSet(String(collectionId));
                            Notify.showNotificationSlider(message);
                        });
                    }, function (errorResponse) {
                        Notify.showApiErrors(errorResponse);
                    });
            };

            $scope.removeFromCollection = function (selectedCollection) {
                var collectionId = selectedCollection.id, collection = selectedCollection.name;

                CollectionEndpoint.removePost({'collectionId': collectionId, 'id': $scope.post.id})
                .$promise
                .then(function () {
                    $translate('notify.collection.removed_from_collection', {collection: collection})
                    .then(function (message) {
                        $scope.post.sets = _.without($scope.post.sets, String(collectionId));
                        Notify.showNotificationSlider(message);
                    });
                }, function (errorResponse) {
                    Notify.showApiErrors(errorResponse);
                });
            };

            $scope.collectionClickHandler = function (collection) {
                $scope.isToggleMode ? $scope.toggleCollection(collection.id) : $scope.goToCollection(collection);
            };

            $scope.goToCollection = function (collection) {
                $scope.collectionListingVisible = false;
                $location.path($scope.path + collection.id + '/' + collection.view);
            };

            $scope.createNewCollection = function () {
                $scope.collectionListingVisible = false;
                $scope.isToggleMode ? $rootScope.$emit('collectionCreate:show', $scope.posts) : $rootScope.$emit('collectionEditor:show');
            };

            $scope.searchCollections = function (collectionQuery) {
                $scope.collections = CollectionEndpoint.editableByMe(
                    {
                        q: collectionQuery
                    }
                );
            };
            // Update collection listing when collection are updated elsewhere
            // in the app
            $rootScope.$on('collection:update', function () {
                $scope.loadCollections();
            });

            $rootScope.$on('collectionListing:show', function () {
                $scope.collectionListingVisible = true;
                $scope.loadCollections();
            });

            $rootScope.$on('collectionToggle:show', function (event, posts) {
                $scope.posts = posts;
                $scope.collectionListingVisible = true;
                $scope.isToggleMode = true;
                $scope.loadCollections();
            });

            $rootScope.$on('collectionToggle:show:afterCreate', function (event, posts, collection) {
                $scope.posts = posts;
                $scope.addToCollection(collection);
                $scope.collectionListingVisible = true;
                $scope.isToggleMode = true;
                $scope.loadCollections();
            });
        },
        templateUrl: 'templates/sets/collections/collection-listing.html'
    };
}];
