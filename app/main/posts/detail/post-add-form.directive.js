module.exports = [
    'FormEndpoint',
    'PostEndpoint',
    '$translate',
    'Notify',
    '$location',
function (
    FormEndpoint,
    PostEndpoint,
    $translate,
    Notify,
    $location
) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            post: '='
        },
        templateUrl: 'templates/posts/add-form.html',
        link: function ($scope) {
            $translate('post.unstructured.add_survey.info', {source: $scope.post.source})
            .then(function (message) {
                $scope.surveyInfo = message;
            });

            $scope.addForm = function () {
                $scope.post.form  = { id: $scope.selectedSurvey };

                PostEndpoint.update($scope.post).$promise.then(function (response) {
                    Notify.notify('notify.post.save_success', {name: $scope.post.title});
                    $location.path('/posts/' + $scope.post.id + '/edit');
                }, function (errorResponse) {
                    Notify.apiErrors(errorResponse);
                });
            };

            FormEndpoint.query().$promise.then(function (surveys) {
                $scope.surveys = surveys;

                if (surveys.length > 0) {
                    $scope.selectedSurvey = surveys[0].id;
                }
            });
        }
    };
}];
