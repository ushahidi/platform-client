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

            $scope.collectionTogglePostVisible = false;
            $scope.path = '/collections/';
            $scope.selectedCollections = [];

            $scope.loadCollections = function () {
                CollectionEndpoint.editableByMe().$promise.then(function (collections) {
                    $scope.collections = collections;
                });
            };

            $scope.postInCollection = function (collection) {
                return $scope.posts.length === 1 ? _.contains($scope.posts[0].sets, String(collection.id)) : false;
            };

            $scope.goToCollection = function (id) {
                $scope.collectionTogglePostVisible = false;
                $location.path($scope.path + id);
            };

            $scope.createNewCollection = function () {
                $scope.collectionTogglePostVisible = false;
                // Need to ensure that the create new dialog will return control to add collection
                // after creating a new dialog
                // creat new should send an event to collection toggle requesting the collection id be set 
                // for the post(s)
                $rootScope.$emit('event:collection:show:editor');
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

            $scope.searchCollections = function (collectionQuery) {
                $scope.collections = CollectionEndpoint.editableByMe(
                    {
                        q: collectionQuery
                    }
                );
            };
            // Update collection listing when collection are updated elsewhere
            // in the app
            $rootScope.$on('event:collection:update', function () {
                $scope.loadCollections();
            });

            $rootScope.$on('event:collection:show:toggle', function (event, posts) {
                $scope.posts = posts;
                $scope.collectionTogglePostVisible = true;
                $scope.loadCollections();
            });
        },
        templateUrl: 'templates/sets/collection-toggle-post.html'
    };
}];
