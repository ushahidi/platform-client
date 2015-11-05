module.exports = [
    '$q',
    '$location',
    '$translate',
    '$rootScope',
    'CollectionEndpoint',
    '_',
    'Notify',
    'PostViewHelper',
    'RoleHelper',
function (
    $q,
    $location,
    $translate,
    $rootScope,
    CollectionEndpoint,
    _,
    Notify,
    PostViewHelper,
    RoleHelper
) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'templates/sets/collection-editor.html',
        scope: {
            collection: '=',
            isOpen: '='
        },
        link: function ($scope, $element, $attrs) {
            $scope.isAdmin = $rootScope.isAdmin;

            $scope.roles = RoleHelper.roles();
            $scope.views = PostViewHelper.views();

            // Set default view for Collection to be Map
            if (!$scope.collection) {
                $scope.collection = {};
                $scope.collection.view = 'map';
                $scope.collection.visible_to = [];
            }
            $scope.cpyCollection = _.clone($scope.collection);

            $scope.$watch(function () {
                return $scope.isOpen.data;
            }, function (newValue, oldValue) {
                if (!newValue) {
                    $scope.cpyCollection = _.clone($scope.collection);
                }
            });
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
                    $scope.isOpen.data = false;
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
