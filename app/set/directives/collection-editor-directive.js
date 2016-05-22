module.exports = [
    '$q',
    '$location',
    '$translate',
    '$rootScope',
    'CollectionEndpoint',
    '_',
    'Notify',
    'ViewHelper',
    'RoleEndpoint',
function (
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
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'templates/sets/collection-editor.html',
        scope: {
        },
        link: function ($scope, $element, $attrs) {
            $scope.collectioneditorVisible = false;

            $rootScope.$on('event:collection:show:editor', function (event, collection) {
                // Set inbound collection
                // if no collection is provided then we are creating
                // a collection
                $scope.collection = collection;
                $scope.collectionEditorVisible = true;
            });

            $scope.isAdmin = $rootScope.isAdmin;

            RoleEndpoint.query().$promise.then(function (roles) {
                $scope.roles = roles;
            });

            $scope.views = ViewHelper.views();

            $scope.featuredEnabled = function () {
                return $rootScope.hasPermission('Manage Posts');
            };

            // Set default view for Collection to be Map
            if (!$scope.collection) {
                $scope.collection = {};
                $scope.collection.view = 'map';
                $scope.collection.visible_to = [];
            }
            $scope.cpyCollection = _.clone($scope.collection);

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
    };
}];
