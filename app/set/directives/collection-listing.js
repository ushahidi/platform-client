module.exports = [
    '$rootScope',
    '$location',
    'CollectionEndpoint',
    '_',
function (
    $rootScope,
    $location,
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

            $scope.loadCollections = function () {
                $scope.collections = CollectionEndpoint.editableByMe();
            };

            // Load collection set
            $scope.loadCollections();

            $scope.goToCollection = function (id) {
                $scope.collectionListingVisible = false;
                $location.path($scope.path + id);
            };

            $scope.createNewCollection = function () {
                $scope.collectionListingVisible = false;
                $rootScope.$emit('event:collection:show:editor');

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

            $rootScope.$on('event:collection:show:listing', function () {
                $scope.collectionListingVisible = true;
            });
        },
        templateUrl: 'templates/sets/collection-listing.html'
    };
}];
