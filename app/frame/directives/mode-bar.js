module.exports = [
    'ViewHelper',
    'Authentication',
    '$rootScope',
function (
    ViewHelper,
    Authentication,
    $rootScope
) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            currentUser: '='
        },
        templateUrl: 'templates/frame/mode-bar.html',
        link: function ($scope, $element, $attrs) {
            $scope.views = ViewHelper.views();

            // TODO: move this out of function
            $scope.activeView = 'map';
            $scope.setActiveView = function (view_name) {
                $scope.activeView = view_name;
            };

            $scope.baseUrl = 'views/';
            $scope.activeMode = 'map';
            $scope.isActivityAvailable = ViewHelper.isViewAvailable('activity');

            // Show login modal
            $scope.login = function () {
                $rootScope.$emit('event:login:show:loginModal');
            };

            // Log user out
            $scope.logout = function () {
                Authentication.logout();
            };

            // Show collection listing
            $scope.viewCollectionListing = function () {
                $rootScope.$emit('collectionListing:show');
            };

            $rootScope.$on('event:mode:change', function (ev, mode) {
                $scope.activeMode = mode;
            });

            $rootScope.$on('event:collection:show', function (ev, collection) {
                $scope.baseUrl = 'collections/' + collection.id + '/';
            });

            $rootScope.$on('event:collection:close', function (ev, savedsearch) {
                $scope.baseUrl = 'views/';
            });

            $rootScope.$on('event:savedsearch:show', function (ev, savedsearch) {
                $scope.baseUrl = 'savedsearches/' + savedsearch.id + '/';
            });

            $rootScope.$on('event:savedsearch:close', function (ev, savedsearch) {
                $scope.baseUrl = 'views/';
            });
        }
    };
}];
