module.exports = [
    '$rootScope',
    '$location',
    '$window',
    '$scope',
    'Authentication',
    'ConfigEndpoint',
function (
    $rootScope,
    $location,
    $window,
    $scope,
    Authentication,
    ConfigEndpoint
) {
    var USHAHIDI = 'Ushahidi';
    $scope.siteTitle = USHAHIDI;
    $scope.pageTitle = null;
    $scope.pageDescription = null;
    $scope.pageKeywords = null;
    $scope.pageRobots = null;

    $scope.appStoreId = $window.ushahidi.appStoreId;

    $scope.currentFullUrl = $location.absUrl();

    // Then update from server
    $scope.reloadSiteConfig = function () {
        ConfigEndpoint.get({ id: 'site' }).$promise.then(function (site) {
            $scope.siteTitle = site.name ? site.name : USHAHIDI;
        });
    };

    $rootScope.$on('event:update:header', function () {
        $scope.reloadSiteConfig();
    });
    $scope.reloadSiteConfig();

    $rootScope.$on('setPageTitle', function (event, title) {
        $scope.pageTitle = null;

        if (title && title.length) {
            $scope.pageTitle = title + ' - ';
        }
    });

    $rootScope.$on('setPageDescription', function (event, description) {
        $scope.pageDescription = null;

        if (description && description.length) {
            $scope.pageDescription = description;
        }
    });

    $rootScope.$on('setPageKeywords', function (event, keywords) {
        $scope.pageKeywords = null;

        if (keywords && keywords.length) {
            $scope.pageKeywords = keywords;
        }
    });

    $rootScope.$on('setPageRobots', function (event, robots) {
        $scope.pageRobots = null;

        if (robots) {
            if (robots === true) {
                $scope.pageRobots = 'index, follow';
            } else if (robots === false) {
                $scope.pageRobots = 'noindex, nofollow';
            } else if (robots.length) {
                $scope.pageRobots = robots;
            }
        }
    });
}];
