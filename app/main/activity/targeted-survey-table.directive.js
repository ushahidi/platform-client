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

TargetedSurveyTableController.$inject = ['$rootScope', '$scope', '$translate', 'FormEndpoint', 'FormStatsEndpoint', 'FormContactEndpoint', 'PostEndpoint', '_', 'PostFilters', 'Session'];
function TargetedSurveyTableController($rootScope, $scope, $translate, FormEndpoint, FormStatsEndpoint, FormContactEndpoint, PostEndpoint, _, PostFilters, Session) {
    $scope.targetedSurveyStatsByForm = [];
    $scope.totalResponsesReduced = 0;
    $scope.totalMessagesSentReduced = 0;
    $scope.totalRecipientsReduced = 0;
    $scope.totalResponseRecipientsReduced = 0;
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
        $scope.totalResponsesReduced = 0;
        $scope.totalMessagesSentReduced = 0;
        $scope.totalRecipientsReduced = 0;
        $scope.totalResponseRecipientsReduced = 0;
    }

    function getFormStats() {
        FormEndpoint.query().$promise.then((forms) => {
            if (!targetedSurveysExist(forms)) {
                $scope.noSurveys = true;
            } else {
                $scope.noSurveys = false;
                forms.forEach((form) => {
                    if (form.targeted_survey) {
                        let query = PostFilters.getQueryParams($scope.filters) || {};
                        var postQuery = _.extend({}, query, {
                            formId: form.id
                        });
                        FormStatsEndpoint.query(postQuery).$promise.then((stats) => {
                            stats.name = form.name;
                            $scope.targetedSurveyStatsByForm.push(stats);
                            $scope.totalResponsesReduced += stats.total_responses;
                            $scope.totalMessagesSentReduced += stats.total_messages_sent;
                            $scope.totalRecipientsReduced += stats.total_recipients;
                            $scope.totalResponseRecipientsReduced += stats.total_response_recipients;
                        });
                    }
                });
            }
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
