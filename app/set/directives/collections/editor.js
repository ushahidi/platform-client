module.exports = CollectionEditor;

CollectionEditor.$inject = [];
function CollectionEditor () {
    return {
        restrict: 'E',
        scope: {
        },
        controller: CollectionEditorController,
        templateUrl: 'templates/sets/collections/collection-editor.html'
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
    'RoleEndpoint'
];
function CollectionEditorController (
    $scope,
    $q,
    $location,
    $translate,
    $rootScope,
    CollectionEndpoint,
    _,
    Notify,
    ViewHelper,
    RoleEndpoint
) {
    $scope.collectioneditorVisible = false;
    $scope.redirectToCollectionListing = false;
    $scope.isAdmin = $rootScope.isAdmin;
    $scope.views = ViewHelper.views();

    // Set default view for Collection to be Map
    $scope.setBasicCollection = function () {
        $scope.collection = {};
        $scope.collection.view = 'map';
        $scope.collection.visible_to = [];
        $scope.cpyCollection = _.clone($scope.collection);
    };

    if (!$scope.collection) {
        $scope.setBasicCollection();
    }

    RoleEndpoint.query().$promise.then(function (roles) {
        $scope.roles = roles;
    });

    $rootScope.$on('event:collection:show:editor', function (event, collection) {
        // Set inbound collection
        // if no collection is provided then we are creating
        // a collection
        $scope.collection = collection;
        $scope.cpyCollection = _.clone($scope.collection);
        $scope.collectionEditorVisible = true;
    });

    $rootScope.$on('event:collection:show:create', function (event, posts) {
        // Set inbound posts
        // if posts are provided then we need to pass flow
        // back to collection listing once creation is complete
        if (posts) {
            // Posts will be passed back to collection listing
            // This is a stop-gap until we have a data layer to maintain
            // state
            $scope.posts = posts;
            $scope.redirectToCollectionListing = true;
        }
        $scope.collectionEditorVisible = true;
    });

    $scope.featuredEnabled = function () {
        return $rootScope.hasPermission('Manage Posts');
    };

    $scope.continueFlow = function (collection) {
        $scope.redirectToCollectionListing ? $rootScope.$emit('event:collection:show:toggle:after:create', $scope.posts, collection ) : $location.path('/collections/' + collection.id);
    };
    $scope.cancel = function () {
        $scope.collectionEditorVisible = false;
    };

    $scope.saveCollection = function (collection) {
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
            // and close the modal
            $scope.collection = _.clone(collection);
            $scope.collectionEditorVisible = false;
            $rootScope.$broadcast('event:collection:update');
            $scope.setBasicCollection();
            $scope.continueFlow(collection);

        }, function (errorResponse) {
            Notify.showApiErrors(errorResponse);
        });
    };

    $scope.deleteCollection = function () {
        $translate('notify.collection.delete_collection_confirm')
        .then(function (message) {
            Notify.showConfirm(message).then(function () {
                CollectionEndpoint.delete({
                    collectionId: $scope.collection.id
                }).$promise.then(function () {
                    $location.url('/');
                    $rootScope.$broadcast('event:collection:update');
                }, function (errorResponse) {
                    Notify.showApiErrors(errorResponse);
                });
            });
        });
    };
}
