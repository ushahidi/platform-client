module.exports = PostChangeLog;

PostChangeLog.$inject = ['$translate','PostsChangeLogEndpoint'];

function PostChangeLog($translate, PostsChangeLogEndpoint) {
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

        $scope.$watch('postId', function (newValue, oldValue) {
                if (newValue) {
                    activate();
                }
            }, true);

        activate();

        function activate() {
            $scope.displayChangeLog = true;
            if ($scope.postId) {
                PostsChangeLogEndpoint.get({post_id: $scope.postId}, function (response) {
                    console.log(response);
                    $scope.displayChangeLog = true;
                    $scope.logEntries = response.results;
                    $scope.entriesLoaded = true;
                }, function (error) {
                    console.log('No changelog available. Not displaying changelog template.', error);
                });
            }
        }

        $scope.postSaveCleanup = function () {
            $scope.entriesLoaded = false; //stop progress bar
            activate(); // reload
            $scope.manualLogEntry = ''; //
        };

        $scope.saveManualLogEntry = function () {
            var changeLogEntry = {
                post_id: $scope.postId,
                content: $scope.manualLogEntry,
                entry_type: 'm' };

            //TODO:  some validation -- follow PostEndpoint version
            var saveRequest = PostsChangeLogEndpoint.save(changeLogEntry);
            console.log('saving....');
            $scope.entriesLoaded = false;

            saveRequest.$promise.then(function (response) {
                $scope.postSaveCleanup();
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
