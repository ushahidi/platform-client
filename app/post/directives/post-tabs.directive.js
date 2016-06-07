module.exports = PostVerticalTabs;

PostVerticalTabs.$inject = [];
function PostVerticalTabs() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            form: '=',
            post: '=',
            stages: '=',
            attributes: '=',
            visibleStage: '='
        },
        controller: PostVerticalTabsController,
        templateUrl: 'templates/posts/modify/post-tabs.html'
    };
}

PostVerticalTabsController.$inject = [
    '$scope',
    'FormEndpoint',
    'FormStageEndpoint',
    'FormAttributeEndpoint',
    'PostEditService',
    'TagEndpoint',
    '_'
];
function PostVerticalTabsController(
    $scope,
    FormEndpoint,
    FormStageEndpoint,
    FormAttributeEndpoint,
    PostEditService,
    TagEndpoint,
    _
) {
    $scope.setVisibleStage = setVisibleStage;
    $scope.isStageValid = isStageValid;
    $scope.isFirstStage = isFirstStage;
    $scope.stageIsComplete = stageIsComplete;
    $scope.toggleStageCompletion = toggleStageCompletion;

    activate();

    function activate() {
        $scope.setVisibleStage($scope.visibleStage);
        TagEndpoint.query().$promise.then(function (results) {
            $scope.categories = results;
        });
    }

    function setVisibleStage(stageId) {
        $scope.visibleStage = stageId;
    }

    function isFirstStage(stageId) {
        return PostEditService.isFirstStage($scope.stages, stageId);
    }

    function isStageValid(stageId) {
        return PostEditService.isStageValid(stageId, $scope.form, $scope.stages, $scope.attributes);
    }

    function stageIsComplete(stageId) {
        return _.includes($scope.post.completed_stages, stageId);
    }

    function toggleStageCompletion(stageId) {

        stageId = parseInt(stageId);
        if (_.includes($scope.post.completed_stages, stageId)) {
            $scope.post.completed_stages = _.without($scope.post.completed_stages, stageId);

        } else if ($scope.isStageValid(stageId)) {
            $scope.post.completed_stages.push(stageId);
        }
    }
}
