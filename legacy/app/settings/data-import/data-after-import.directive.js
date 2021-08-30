module.exports = [
    '$rootScope',
    '$translate',
    '$location',
function (
    $rootScope,
    $translate,
    $location
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
