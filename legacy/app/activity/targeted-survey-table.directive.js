module.exports = TargetedSurveyTable;

function TargetedSurveyTable() {
    return {
        restrict: 'E',
        scope: {
            filters: '='
        },
        controller: TargetedSurveyTableController,
        template: require('./targeted-survey-table.html')
    };
}

TargetedSurveyTableController.$inject = ['$rootScope', '$scope', '$translate', 'FormEndpoint', 'FormStatsEndpoint', 'PostEndpoint', '_', 'PostFilters', 'Session'];
function TargetedSurveyTableController($rootScope, $scope, $translate, FormEndpoint, FormStatsEndpoint, PostEndpoint, _, PostFilters, Session) {
    $scope.targetedSurveyStatsByForm = [];
    $scope.totalResponses = 0;
    $scope.totalMessagesSent = 0;
    $scope.totalRecipients = 0;
    $scope.totalResponseRecipients = 0;
    $scope.noSurveys = false;

    // whenever the filters changes, update the current list of posts
    // this also initiates the first call to get form stats because
    // it is called when the filters load the first time
    $scope.$watch('filters', function () {
        if ($rootScope.loggedin) {
            clearStats();
            getFormStats();
        }
    }, true);
    PostFilters.setMode('activity');

    function clearStats() {
        $scope.targetedSurveyStatsByForm = [];
        $scope.totalResponses = 0;
        $scope.totalMessagesSent = 0;
        $scope.totalRecipients = 0;
        $scope.totalResponseRecipients = 0;
    }

    function getFormStats() {
        FormEndpoint.query({ignore403: '@ignore403'}).$promise.then((forms) => {
            if (!targetedSurveysExist(forms)) {
                $scope.noSurveys = true;
            } else {
                $scope.noSurveys = false;
                forms.forEach((form) => {
                    if (form.targeted_survey) {
                        let query = PostFilters.getQueryParams($scope.filters) || {};
                        let postQuery = _.extend({}, query, {
                            formId: form.id,
                            'ignore403': '@ignore403'
                        });
                        FormStatsEndpoint.query(postQuery).$promise.then((stats) => {
                            stats.name = form.name;
                            $scope.targetedSurveyStatsByForm.push(stats);
                            $scope.totalResponses += stats.total_responses;
                            $scope.totalMessagesSent += stats.total_messages_sent;
                            $scope.totalRecipients += stats.total_recipients;
                            $scope.totalResponseRecipients += stats.total_response_recipients;
                        }).catch((err) => {
                            $scope.noSurveys = true;
                        });
                    }
                });
            }
        }).catch((err) => {
            $scope.noSurveys = true;
        });
    }

    function targetedSurveysExist(forms) {
        return forms.find((form) => {
            if (form.targeted_survey) {
                return true;
            }
        });
    }
}
