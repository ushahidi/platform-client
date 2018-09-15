module.exports = ['PostEndpoint', 'moment', '_', function (PostEndpoint, moment, _) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            key: '=',
            value: '=',
            attribute: '=',
            type: '=',
            tags: '='
        },
        template: require('./post-value.html'),
        link: function ($scope) {
            $scope.confidenceScores = $scope.$parent.post.tags_confidence_score;
            // This whole directive is wrong and it should feel wrong
            // Depending on whether we are dealing with a post task or a standard task
            // the css class is swapped. This Boolean manages that distinction.
            $scope.standardTask = $scope.type === 'standard';
            // TODO Move to Service
            $scope.formatTags = function (tagIds) {
                // getting tag-names and formatting them for displaying
                var formatedTags = ' ';
                _.each(tagIds, function (tag, index) {
                    var tagObj = _.where($scope.tags, {id: parseInt(tag)});
                    if (tagObj[0]) {
                        tag = tagObj[0].tag;
                        if (index < tagIds.length - 1) {
                            formatedTags += tag + ', ';
                        } else {
                            formatedTags += tag;
                        }
                    }
                });
                return formatedTags;
            };
            // TODO Move to Service ewwwwww
            $scope.formatTagsWithScores = function (tagIds) {
                var withChildren = [];
                // getting tag-names and formatting them for displaying
                _.each(tagIds, function (tag, index) {
                    var tagObj = _.where($scope.tags, {id: parseInt(tag)});
                    var confidenceScoreTag = _.where($scope.confidenceScores, {tag_id: tag}).pop();
                    if (confidenceScoreTag && tagObj[0]) {
                        confidenceScoreTag.tag_name = tagObj[0].tag;
                        confidenceScoreTag.score = Math.round(confidenceScoreTag.score);
                        confidenceScoreTag.source = confidenceScoreTag.source ? 'SOURCE: ' + confidenceScoreTag.source : 'SOURCE: Unknown';
                        withChildren.push(confidenceScoreTag);
                    } else if (tagObj[0]) {
                        let confidenceScoreNew = {
                            score: null,
                            tag_name: tagObj[0].tag
                        };
                        withChildren.push(confidenceScoreNew);
                    }
                });
                return withChildren;
            };

            if ($scope.attribute.type === 'relation') {
                $scope.value = $scope.value.map(function (entry) {
                    return PostEndpoint.get({id: entry});
                });
            }
            if ($scope.attribute.input === 'tags' && $scope.confidenceScores.length === 0) {
                $scope.value = $scope.formatTags($scope.value);
            } else if ($scope.attribute.input === 'tags' && $scope.confidenceScores.length > 0) {
                $scope.value = $scope.formatTagsWithScores($scope.value);
            }
            if ($scope.attribute.type === 'datetime') {
                if ($scope.attribute.input === 'date') {
                    $scope.value = $scope.value.map(function (entry) {
                        return moment(entry).format('LL');
                    });
                }
                if ($scope.attribute.input === 'datetime') {
                    $scope.value = $scope.value.map(function (entry) {
                        return moment(entry).format('LLL');
                    });
                }
                if ($scope.attribute.input === 'time') {
                    $scope.value = $scope.value.map(function (entry) {
                        return moment(entry).format('LT');
                    });
                }
            }
        }
    };
}];
