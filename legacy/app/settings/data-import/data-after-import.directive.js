module.exports = [
    '$rootScope',
    '$translate',
    '$location',
    'Features',
function (
    $rootScope,
    $translate,
    $location,
    Features
) {
    return {
        restrict: 'A',
        link: function ($scope, $element, $attrs) {
            $scope.importComplete = false;

            $rootScope.$on('event:import:complete', function (event, args) {
                $scope.collectionId = args.collectionId;
                $scope.filename = args.filename;
                $scope.importComplete = true;
            });
        }
    };
}];
