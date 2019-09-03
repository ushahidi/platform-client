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
    $scope.totalAll = 0;
    $scope.totalWeb = 0;
    $scope.totalEmail = 0;
    $scope.totalSms = 0;
    $scope.totalTwitter = 0;
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
        $scope.totalAll = 0;
        $scope.totalWeb = 0;
        $scope.totalEmail = 0;
        $scope.totalSms = 0;
        $scope.totalTwitter = 0;
        $scope.unstructuredStats = {};
    }

    function getFormStats() {
        FormEndpoint.query({ignore403: '@ignore403'}).$promise.then((forms) => {
            if (!crowdsourcedSurveysExist(forms)) {
                $scope.noSurveys = true;
            } else {
                $scope.noSurveys = false;
                forms.forEach((form) => {
                    if (!form.targeted_survey) {
                        let query = PostFilters.getQueryParams($scope.filters) || {};
                        let postQuery = _.extend({}, query, {
                            formId: form.id,
                            ignore403: '@ignore403'
                        });

                        FormStatsEndpoint.query(postQuery).$promise.then((stats) => {
                            stats.name = form.name;
                            $scope.crowdsourcedSurveyStatsByForm.push(stats);
                            $scope.totalAll += parseInt(stats.total_by_data_source.all);
                            $scope.totalWeb += parseInt(stats.total_by_data_source.web);
                            $scope.totalEmail += parseInt(stats.total_by_data_source.email);
                            $scope.totalSms += parseInt(stats.total_by_data_source.sms);
                            $scope.totalTwitter += parseInt(stats.total_by_data_source.twitter);
                        }).catch((err) => {
                            $scope.noSurveys = true;
                        });
                    }
                });
                let query = PostFilters.getQueryParams($scope.filters) || {};
                let postQuery = _.extend({}, query, {
                    include_unmapped: true,
                    group_by: 'form',
                    has_location: 'all',
                    order: 'desc',
                    order_unlocked_on_top: true,
                    orderby: 'created',
                    status: 'all',
                    form: 'none'
                });

                PostEndpoint.stats(postQuery).$promise.then((totals) => {
                    $scope.unstructuredStats = {
                        name: 'Unstructured Posts',
                        all: 0,
                        web: 0,
                        email: 0,
                        sms: 0,
                        twitter: 0
                    };
                    totals.totals[0].values.forEach((stat) => {
                        $scope.unstructuredStats[stat.type] = stat.total;
                        $scope.unstructuredStats.all += stat.total;
                    });
                    $scope.totalAll += $scope.unstructuredStats.all;
                    $scope.totalWeb += $scope.unstructuredStats.web;
                    $scope.totalEmail += $scope.unstructuredStats.email;
                    $scope.totalSms += $scope.unstructuredStats.sms;
                    $scope.totalTwitter += $scope.unstructuredStats.twitter;
                }).catch((err) => {
                    $scope.noSurveys = true;
                });
            }
        }).catch((err) => {
            $scope.noSurveys = true;
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
