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
        template: require('./post-tabs.html')
    };
}

PostVerticalTabsController.$inject = [
    '$scope',
    'FormEndpoint',
    'FormStageEndpoint',
    'FormAttributeEndpoint',
    'PostEditService',
    '_'
];
function PostVerticalTabsController(
    $scope,
    FormEndpoint,
    FormStageEndpoint,
    FormAttributeEndpoint,
    PostEditService,
    _
) {
    $scope.setVisibleStage = setVisibleStage;
    $scope.stageIsComplete = stageIsComplete;
    $scope.toggleStageCompletion = toggleStageCompletion;

    activate();

    function activate() {
        $scope.setVisibleStage($scope.visibleStage);
    }

    function setVisibleStage(stageId) {
        $scope.visibleStage = stageId;
    }

    function stageIsComplete(stageId) {
        return _.includes($scope.post.completed_stages, stageId);
    }

    function toggleStageCompletion(stageId) {

        stageId = parseInt(stageId);
        if (_.includes($scope.post.completed_stages, stageId)) {
            $scope.post.completed_stages = _.without($scope.post.completed_stages, stageId);

        } else {
            $scope.post.completed_stages.push(stageId);
        }
    }
}
