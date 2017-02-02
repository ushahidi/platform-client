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
        template: require('./editor.html')
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

    activate();

    function activate() {
        if (!$scope.collection) {
            setBasicCollection();
        } else {
            $scope.cpyCollection = angular.copy($scope.collection);
        }

        RoleEndpoint.query().$promise.then(function (roles) {
            $scope.roles = roles;
        });
    }

    // Set default view for Collection to be Map
    function setBasicCollection() {
        $scope.cpyCollection = {};
        $scope.cpyCollection.view = 'map';
        $scope.cpyCollection.role = [];
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

        // Collection endpoint uses collectionId so make sure thats set
        collection.collectionId = collection.id;

        // Save the collection
        persist(collection)
        .$promise
        .then(function (savedCollection) {
            $scope.collection = angular.copy(savedCollection);
            // and close the modal
            $scope.$parent.closeModal();
            // If we were adding posts, show the add to collection dialog again
            if ($scope.posts) {
                CollectionsService.showAddToCollection($scope.posts);
            } else {
                // Broadcast the updated collection
                $rootScope.$broadcast('collection:update', savedCollection);
            }
            Notify.notify(collection.id ? 'notify.collection.updated_collection' : 'notify.collection.created_collection', { collection: savedCollection.name });
        }, function (errorResponse) {
            Notify.apiErrors(errorResponse);
        });
    }
}
