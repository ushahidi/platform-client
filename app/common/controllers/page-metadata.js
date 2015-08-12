module.exports = [
    '$rootScope',
    '$scope',
    'Authentication',
    'ConfigEndpoint',
function (
    $rootScope,
    $scope,
    Authentication,
    ConfigEndpoint
) {

    $scope.siteTitle = 'Ushahidi';
    $scope.pageTitle = null;
    $scope.pageDescription = null;
    $scope.pageKeywords = null;
    $scope.pageRobots = null;

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
