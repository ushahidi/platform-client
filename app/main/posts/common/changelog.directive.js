module.exports = PostChangeLog;

PostChangeLog.$inject = ['$rootScope','$translate','PostsChangeLogEndpoint'];

function PostChangeLog($rootScope, $translate, PostsChangeLogEndpoint) {
    return {
        restrict: 'E',
        scope: {
            postId: '='
        },
        link: PostChangeLogLink,
        template: require('./changelog.html')
    };

    function PostChangeLogLink($scope, element, attrs) {
        $scope.displayChangeLog = false;
        $scope.logEntries = [];
        $scope.entriesLoaded = false;
        $scope.enteringManually = false;
        $scope.manualLogEntry = '';
        $scope.hasCreatePermission = $rootScope.hasPermission('Manage Posts');

        $scope.$watch('postId', function (newValue, oldValue) {
                if (newValue) {
                    activate();
                }
            }, true);

        activate();

        function activate() {
            $scope.displayChangeLog = true;

            //  reset to blank
            $scope.manualLogEntry = ''; // set to blank on reload
            $scope.entriesLoaded = false;
            $scope.logEntries = [];

            // then load what we can load
            if ($scope.postId) {
                PostsChangeLogEndpoint.get({post_id: $scope.postId}, function (response) {
                    console.log(response);
                    $scope.displayChangeLog = true;
                    $scope.logEntries = response.results;
                    $scope.entriesLoaded = true;
                }, function (error) {
                    console.log('No changelog available.', error);
                });
            }
        }

        $scope.postSaveCleanup = function () {
            $scope.entriesLoaded = false; //stop progress bar
            activate(); // reload
            $scope.manualLogEntry = ''; //
        };

        $scope.saveManualLogEntry = function () {
            console.log('saving....', $scope.manualLogEntry);

            var changeLogEntry = {
                post_id: $scope.postId,
                content: $scope.manualLogEntry,
                entry_type: 'm' };

            //TODO:  some validation -- follow PostEndpoint version

            var saveRequest = PostsChangeLogEndpoint.save(changeLogEntry);
            $scope.entriesLoaded = false;

            saveRequest.$promise.then(function (response) {
                $scope.postSaveCleanup();
                $scope.successfulSave = true;
            }, function (error) {
                console.log('Could not save post: ', error);
            });
        };

        $scope.cancelAddEntryMode = function () {
            $scope.enteringManually = false;
        };

        $scope.enterAddEntryMode = function () {
            $scope.enteringManually = true;
        };

    }
}
