module.exports = [
    '$rootScope',
    '$translate',
    '$location',
    'Notify',
    'CollectionEndpoint',
    '_',
function (
    $rootScope,
    $translate,
    $location,
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

            // Load collection set
            //$scope.loadCollections();

            $scope.postInCollection = function (collection) {
                return $scope.post ? _.contains($scope.post.sets, String(collection.id)) : false;
            };

            $scope.goToCollection = function (id) {
                $scope.collectionTogglePostVisible = false;
                $location.path($scope.path + id);
            };

            $scope.createNewCollection = function () {
                $scope.collectionTogglePostVisible = false;
                $rootScope.$emit('event:collection:show:editor');

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

            $rootScope.$on('event:collection:show:toggle', function (event, post) {
                $scope.post = post;
                $scope.collectionTogglePostVisible = true;
                $scope.loadCollections();
            });
        },
        templateUrl: 'templates/sets/collection-toggle-post.html'
    };
}];
