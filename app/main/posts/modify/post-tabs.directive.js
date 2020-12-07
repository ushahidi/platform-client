module.exports = PostVerticalTabs;

PostVerticalTabs.$inject = [];
function PostVerticalTabs() {
    return {
        restrict: 'E',
        scope: {
            form: '=',
            post: '=',
            tasks: '=',
            visibleStage: '=',
            medias: '=',
            activeSurveyLanguage:'='

        },
        template: require('./post-tabs.html'),
        controller: PostVerticalTabsController
    };
}

PostVerticalTabsController.$inject = [
    '$scope',
    '_'
];
function PostVerticalTabsController(
    $scope,
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
        return $scope.post.completed_stages.indexOf(stageId) > -1;
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
