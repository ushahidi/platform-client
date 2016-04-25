module.exports = [
    'FormEndpoint',
    'FormStageEndpoint',
    'FormAttributeEndpoint',
    'TagEndpoint',
    '_',
function (
    FormEndpoint,
    FormStageEndpoint,
    FormAttributeEndpoint,
    TagEndpoint,
    _
) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
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

            $scope.isFirstStage = function (stageId) {

                if (!_.isEmpty($scope.stages)) {
                    return stageId === $scope.stages[0].id;
                }
                return false;

            };

            $scope.isStageValid = function (stageId) {

                if ($scope.isFirstStage(stageId)) {

                    // The first stage is assumed to contain the title, content, and the tags
                    //  - these are not stored in attributes and do not have a 'required' field
                    //   thus, if any of these are invalid, the first stage is not ready to complete

                    // Return if form isn't initialized yet
                    if (!$scope.form) {
                        return false;
                    }

                    if ($scope.form.title.$invalid || $scope.form.content.$invalid) {
                        return false;
                    }

                    if ($scope.form.tags && $scope.form.tags.$invalid) {
                        return false;
                    }
                }
                // now checking all other post attributes that are required
                return _.chain($scope.attributes)
                .where({form_stage_id : stageId, required: true})
                .reduce(function (isValid, attr) {
                    // checkbox validity needs to be handled differently
                    // because it has multiple inputs identified via the options
                    if (attr.input === 'checkbox') {
                        var checkboxValidity = false;
                        _.each(attr.options, function (option) {
                            if (!_.isUndefined($scope.form['values_' + attr.key + '_' + option]) && !$scope.form['values_' + attr.key + '_' + option].$invalid) {
                                checkboxValidity = isValid;
                            }
                        });
                        return checkboxValidity;
                    } else {
                        if (_.isUndefined($scope.form['values_' + attr.key]) || $scope.form['values_' + attr.key].$invalid) {
                            return false;
                        }
                        return isValid;
                    }
                }, true)
                .value();
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
