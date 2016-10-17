module.exports = [
    '$rootScope',
    '$translate',
    '$location',
    'Notify',
    'Features',
function (
    $rootScope,
    $translate,
    $location,
    Notify,
    Features
) {
    return {
        restrict: 'A',
        link: function ($scope, $element, $attrs) {
            $scope.importComplete = false;

            $rootScope.$on('event:import:complete', function (event, args) {
                $scope.collectionId = args.collectionId;
                $scope.filename = args.filename;
                $scope.form = args.form;
                $scope.importComplete = true;
            });
        }
    };
}];
