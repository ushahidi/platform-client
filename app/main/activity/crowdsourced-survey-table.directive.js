module.exports = CrowdsourcedSurveyTable;

function CrowdsourcedSurveyTable() {
    return {
        restrict: 'E',
        scope: {
            filters: '='
        },
        controller: CrowdsourcedSurveyTableController,
        template: require('./crowdsourced-survey-table.html')
    };
}

CrowdsourcedSurveyTableController.$inject = ['$scope', '$translate', 'FormEndpoint', 'FormStatsEndpoint', 'FormContactEndpoint', 'PostEndpoint', '_', 'PostFilters', 'Session'];
function CrowdsourcedSurveyTableController($scope, $translate, FormEndpoint, FormStatsEndpoint, FormContactEndpoint, PostEndpoint, _, PostFilters, Session) {
    $scope.crowdsourcedSurveyStatsByForm = [];
    $scope.totalAllReduced = 0;
    $scope.totalWebReduced = 0;
    $scope.totalEmailReduced = 0;
    $scope.totalSmsReduced = 0;
    $scope.totalTwitterReduced = 0;
    $scope.noSurveys = false;
    $scope.unstructuredStats = {};

    // whenever the filters changes, update the current list of posts
    // this also initiates the first call to get form stats because
    // it is called when the filters load the first time
    $scope.$watch('filters', function () {
        clearStats();
        getFormStats();
    }, true);
    PostFilters.setMode('activity');

    function clearStats() {
        $scope.crowdsourcedSurveyStatsByForm = [];
        $scope.totalAllReduced = 0;
        $scope.totalWebReduced = 0;
        $scope.totalEmailReduced = 0;
        $scope.totalSmsReduced = 0;
        $scope.totalTwitterReduced = 0;
        $scope.unstructuredStats = {};
    }

    function getFormStats() {
        FormEndpoint.query().$promise.then((forms) => {
            if (crowdsourcedSurveysExist) {
                $scope.noSurveys = false;
                forms.forEach((form) => {
                    if (!form.targeted_survey) {
                        let query = PostFilters.getQueryParams($scope.filters) || {};
                        var postQuery = _.extend({}, query, {
                            formId: form.id
                        });

                        FormStatsEndpoint.query(postQuery).$promise.then((stats) => {
                            stats.name = form.name;
                            $scope.crowdsourcedSurveyStatsByForm.push(stats);
                            $scope.totalAllReduced += parseInt(stats.total_by_data_source.all);
                            $scope.totalWebReduced += parseInt(stats.total_by_data_source.web);
                            $scope.totalEmailReduced += parseInt(stats.total_by_data_source.email);
                            $scope.totalSmsReduced += parseInt(stats.total_by_data_source.sms);
                            $scope.totalTwitterReduced += parseInt(stats.total_by_data_source.twitter);

                        });
                    }
                });
                let query = PostFilters.getQueryParams($scope.filters) || {};
                var postQuery = _.extend({}, query, {
                    form: 'none'
                });
                PostEndpoint.query(postQuery).$promise.then((posts) => {
                    $scope.unstructuredStats = {
                        name: 'Unstructured Posts',
                        all: posts.results.length,
                        web: 0,
                        email: 0,
                        sms: 0,
                        twitter: 0
                    };
                    posts.results.forEach((post) => {
                        $scope.unstructuredStats[post.source]++;
                    });
                });
            } else {
                $scope.noSurveys = true;
            }
        });
    }

    function crowdsourcedSurveysExist(forms) {
        return forms.find((form) => {
            if (!form.targeted_survey) {
                return true;
            }
        });
    }
}
