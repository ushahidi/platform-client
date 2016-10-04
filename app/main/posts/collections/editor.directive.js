module.exports = CollectionEditor;

CollectionEditor.$inject = [];
function CollectionEditor() {
    return {
        restrict: 'E',
        scope: {
            collection: '<',
            posts: '='
        },
        controller: CollectionEditorController,
        templateUrl: 'templates/main/posts/collections/editor.html'
    };
}

CollectionEditorController.$inject = [
    '$scope',
    '$q',
    '$location',
    '$translate',
    '$rootScope',
    'CollectionEndpoint',
    '_',
    'Notify',
    'ViewHelper',
    'RoleEndpoint',
    'CollectionsService'
];
function CollectionEditorController(
    $scope,
    $q,
    $location,
    $translate,
    $rootScope,
    CollectionEndpoint,
    _,
    Notify,
    ViewHelper,
    RoleEndpoint,
    CollectionsService
) {
    $scope.isAdmin = $rootScope.isAdmin;
    $scope.views = ViewHelper.views();

    $scope.featuredEnabled = featuredEnabled;
    $scope.cancel = cancel;
    $scope.saveCollection = saveCollection;
    $scope.deleteCollection = deleteCollection;

    activate();

    function activate() {
        if (!$scope.collection) {
            setBasicCollection();
        } else {
            $scope.cpyCollection = _.clone($scope.collection);
        }

        RoleEndpoint.query().$promise.then(function (roles) {
            $scope.roles = roles;
        });
    }

    // Set default view for Collection to be Map
    function setBasicCollection() {
        $scope.cpyCollection = {};
        $scope.cpyCollection.view = 'map';
        $scope.cpyCollection.visible_to = [];
    }

    function featuredEnabled() {
        return $rootScope.hasPermission('Manage Posts');
    }

    function cancel() {
        $scope.$parent.closeModal();
    }

    function saveCollection(collection) {
        // Are we creating or updating?
        var persist = collection.id ? CollectionEndpoint.update : CollectionEndpoint.save;

        // Strip out any null values from visible_to
        collection.visible_to = _.without(_.values(collection.visible_to), null);

        // Collection endpoint uses collectionId so make sure thats set
        collection.collectionId = collection.id;

        // Save the collection
        persist(collection)
        .$promise
        .then(function (collection) {
            $scope.collection = _.clone(collection);
            // and close the modal
            $scope.$parent.closeModal();
            // If we were adding posts, show the add to collection dialog again
            if ($scope.posts) {
                CollectionsService.showAddToCollection($scope.posts);
            } else {
                // Reload collection?
            }
            Notify.notify('notify.collection.created_collection', {collection: collection.name});
        }, function (errorResponse) {
            Notify.apiErrors(errorResponse);
        });
    }

    function deleteCollection() {
        CollectionsService.deleteCollection($scope.collection);
    }
}
