module.exports = [
    'FormEndpoint',
    'FormStageEndpoint',
    'FormAttributeEndpoint',
    'PostEditService',
    'TagEndpoint',
    '_',
function (
    FormEndpoint,
    FormStageEndpoint,
    FormAttributeEndpoint,
    PostEditService,
    TagEndpoint,
    _
) {
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
        templateUrl: 'templates/posts/post-stages.html',
        controller: [
            '$scope',
        function ($scope) {
            TagEndpoint.query().$promise.then(function (results) {
                $scope.categories = results;
            });

            $scope.setVisibleStage = function (stageId) {
                $scope.visibleStage = stageId;
            };

            $scope.setVisibleStage($scope.visibleStage);

            $scope.isFirstStage = function (stageId) {
                return PostEditService.isFirstStage($scope.stages, stageId);
            };

            $scope.isStageValid = function (stageId) {
                return PostEditService.isStageValid(stageId, $scope.form, $scope.stages, $scope.attributes);
            };

            $scope.stageIsComplete = function (stageId) {
                return _.includes($scope.post.completed_stages, stageId);
            };

            $scope.toggleStageCompletion = function (stageId) {

                stageId = parseInt(stageId);
                if (_.includes($scope.post.completed_stages, stageId)) {
                    $scope.post.completed_stages = _.without($scope.post.completed_stages, stageId);

                } else if ($scope.isStageValid(stageId)) {
                    $scope.post.completed_stages.push(stageId);
                }
            };
        }]
    };
}];
