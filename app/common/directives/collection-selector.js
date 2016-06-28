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
        '$translate',
        'Notify',
        'CollectionEndpoint',
        '_',
        function (
            $scope,
            $rootScope,
            $translate,
            Notify,
            CollectionEndpoint,
            _
        ) {
            $scope.showNewCollectionInput = false;
            $scope.newCollection = '';
            $scope.editableCollections = [];
            $scope.showCollectionModal = false;

            $scope.refreshCollections = function () {
                CollectionEndpoint.editableByMe().$promise.then(function (results) {
                    $scope.editableCollections = results;
                });
            };

            $scope.refreshCollections();

            $scope.$on('event:collection-selector:update', function () {
                $scope.refrehCollections();
            });

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
                        $scope.post.sets.push(String(collectionId));
                        Notify.notify('notify.collection.add_to_collection', {collection: collection});
                    }, function (errorResponse) {
                        Notify.apiErrors(errorResponse);
                    });
            };

            $scope.removeFromCollection = function (selectedCollection) {
                var collectionId = selectedCollection.id, collection = selectedCollection.name;

                CollectionEndpoint.removePost({'collectionId': collectionId, 'id': $scope.post.id})
                .$promise
                .then(function () {
                    $scope.post.sets = _.without($scope.post.sets, String(collectionId));
                    Notify.notify('notify.collection.removed_from_collection', {collection: collection});
                }, function (errorResponse) {
                    Notify.apiErrors(errorResponse);
                });
            };
            /*
            scope.searchCollections = function (query) {
                CollectionEndpoint.query(query)
                .$promise
                .then(function (result) {
                }, function (errorResponse) {
                    Notify.apiErrors(errorResponse);
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
                    $scope.addToCollection(collection);

                    // Where collection selectors can appear multiple times
                    // it is necessary to force a collection refresh when an update occurs
                    // on anyone collection selector - to ensure that newly created collections
                    // are available in all lists on the page.
                    // TODO: add caching for collections to reduce requests.
                    $rootScope.$broadcast('event:collection:update');
                }, function (errorResponse) {
                    Notify.apiErrors(errorResponse);
                });
            };

        }];
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'templates/common/collection-selector/collection-selector.html',
        scope: {
            posts: '='
        },
        controller: controller
    };
}];
