/**
 * Ushahidi Angular Collection Selector directive
 * Drop in directive for managing collections addition for posts
 */

module.exports = [
function (
) {
    var controller = [
        '$scope',
        '$rootScope',
        'CollectionEndpoint',
        function (
            $scope,
            $rootScope,
            CollectionEndpoint
        ) {
            $scope.showNewCollectionInput = false;
            $scope.newCollection = '';

            $scope.refreshCollections = function () {
                $rootScope.$broadcast('event:collection:update');
            };

            $scope.postInCollection = function (collection) {
                return _.contains($scope.post.sets, String(collection.id));
            };

            $scope.toggleCreateCollection = function () {
                $scope.showNewCollectionInput = !$scope.showNewCollectionInput;
            };

            $scope.toggleCollection = function (selectedCollection) {
                if (_.contains($scope.post.sets, String(selectedCollection.id))) {
                    $scope.removeFromCollection(selectedCollection);
                } else {
                    $scope.addToCollection(selectedCollection);
                }
            };

            $scope.addToCollection = function (selectedCollection) {
                var collectionId = selectedCollection.id, collection = selectedCollection.name;

                CollectionEndpoint.addPost({'collectionId': collectionId, 'id': $scope.post.id})
                    .$promise.then(function () {
                        $translate('notify.collection.add_to_collection', {collection: collection})
                        .then(function (message) {
                            $scope.post.sets.push(String(collectionId));
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
            /*
            scope.searchCollections = function (query) {
                CollectionEndpoint.query(query)
                .$promise
                .then(function (result) {
                }, function (errorResponse) {
                    Notify.showApiErrors(errorResponse);
                });
            };

            scope.clearSearch = function() {
                scope.editableCollection = scope.editableCollectionCopy;
            };
            */
            $scope.createNewCollection = function (collectionName) {
                var collection = {
                    'name': collectionName,
                    'user_id': $rootScope.currentUser.userId
                };
                CollectionEndpoint.save(collection)
                .$promise
                .then(function (collection) {
                    $scope.toggleCreateCollection();
                    $scope.newCollection = '';
                    $scope.refreshCollections();
                    $scope.addToCollection(collection);
                }, function (errorResponse) {
                    Notify.showApiErrors(errorResponse);
                });
            };

    }];

    return {
        restrict: 'E',
        templateUrl: 'templates/collection-selector/collection-selector.html',
        scope: {
            post: '=',
            editableCollections: '='
        },
        controller: controller
    };
}];
