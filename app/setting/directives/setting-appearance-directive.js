module.exports = [
    '$q',
    '$http',
    '$location',
    '$translate',
    '$rootScope',
    'ConfigEndpoint',
    '_',
    'Notify',
    'Util',
function (
    $q,
    $http,
    $location,
    $translate,
    $rootScope,
    ConfigEndpoint,
    _,
    Notify,
    Util
) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            formId: '@',
            formTemplate: '@'
        },
        templateUrl: 'templates/partials/appearance-editor.html',
        link: function ($scope, $element, $attrs) {
            $scope.saving_config = {};
            $scope.appearance = ConfigEndpoint.get({ id: 'site' });

            $scope.fileNameChanged = function (element) {
                $scope.file = element.files[0];
            };

            $scope.updateHeader = function () {
                $rootScope.$broadcast('event:update:header');
            };
            $scope.updateConfig = function (id, model) {
                $scope.saving_config[id] = true;
                // @todo: abstract out to common function
                var formData = new FormData();
                formData.append('file', $scope.file);

                // @todo: abstract this functionality to a general service.
                $http.post(
                    Util.apiUrl('/media'),
                    formData,
                    {
                        headers: {
                            'Content-Type': undefined
                        }
                    }).
                then(function (response) {
                    model.image_header = response.data.original_file_url;
                    model.$update({ id: id }, function () {
                        $scope.saving_config[id] = false;
                        $scope.updateHeader();
                    });

                }, function (errorResponse) {
                    var errors = _.pluck(errorResponse.data && errorResponse.data.errors, 'message');
                    Notify.showAlerts(errors);
                });
            };
        }
    };
}];
