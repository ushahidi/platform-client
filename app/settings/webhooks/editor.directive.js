module.exports = [
    '$q',
    '$translate',
    '$location',
    '$routeParams',
    '$route',
    '_',
    '$state',
    'WebhookEndpoint',
    'FormEndpoint',
    'FormAttributeEndpoint',
    'Notify',
function (
    $q,
    $translate,
    $location,
    $routeParams,
    $route,
    _,
    $state,
    WebhookEndpoint,
    FormEndpoint,
    FormAttributeEndpoint,
    Notify
) {
    return {
        restrict: 'A',
        link: function ($scope, $element, $attrs) {
            $scope.whereToNext = 'settings/webhooks';

            // TODO: This should be set in the settings config table and retrieved from the API
            $scope.event_types = ['create', 'update'];
            $scope.entity_types = ['post'];

            $scope.formEnabled = false;
            $scope.selectedForm = undefined;

            $scope.save = $translate.instant('app.save');
            $scope.saving = $translate.instant('app.saving');
            $scope.processing = false;

            $q.all([
              FormEndpoint.query().$promise,
              WebhookEndpoint.getFresh({id: $scope.$resolve.$transition$.params().id}).$promise
            ]).then(function (response) {
                $scope.forms = response[0];
                $scope.webhook = response[1];

                if ($scope.webhook.form_id) {
                    $scope.toggleFormAssociation();
                    var form = _.find($scope.forms, function (form) {
                        return form.id === $scope.webhook.form_id;
                    });

                    $scope.setSelectedForm(form);
                }

                $scope.title = $scope.webhook.id ? 'webhook.edit_webhook' : 'webhook.add_webhook';

                $translate($scope.title).then(function (title) {
                    $scope.title = title;
                    $scope.$emit('setPageTitle', title);
                });
            });


            $scope.cancel = function () {
                $location.path($scope.whereToNext);
            };

            $scope.saveWebhook = function (webhook) {
                $scope.processing = true;
                webhook.name = webhook.name ? webhook.name : webhook.display_name;

                WebhookEndpoint.saveCache(webhook).$promise.then(function (result) {
                    Notify.notify('notify.webhook.save_success', {webhook: webhook.display_name});
                    $location.path($scope.whereToNext);
                }, function (errorResponse) { // error
                    Notify.apiErrors(errorResponse);
                });
                $scope.processing = false;
            };

            var handleResponseErrors = function (errorResponse) {
                $scope.processing = false;
                Notify.apiErrors(errorResponse);
            };


            $scope.getFormAttributes = function (form) {

                if ($scope.selectedForm.attributes) {
                    return;
                }

                $scope.selectedForm.attributes = [];

                // Get Attributes if not previously loaded
                FormAttributeEndpoint.query({formId: form.id}).$promise.then(function (results) {
                    // Due to the oddness of title and description being both Post fields and Attributes
                    // it is necessary to construct an index into the Post object that can be used with the
                    // Laravel/Kohana function array_get/array_set
                    _.each(results, function (attribute) {
                        if (attribute.type === 'title' || attribute.type === 'description') {
                            attribute.post_key = attribute.type === 'title' ? attribute.type : 'content';
                        } else {
                            attribute.post_key = 'values.' + attribute.key;
                        }
                        $scope.selectedForm.attributes.push(attribute);
                    });
                });
            };

            $scope.setSelectedForm = function (form, provider_id) {
                $scope.webhook.form_id = form.id;
                $scope.selectedForm = form;
                $scope.getFormAttributes(form);
            };

            $scope.toggleFormAssociation = function () {
                if ($scope.formEnabled) {
                    if ($scope.webhook.form_id) {
                        $scope.selectedForm = undefined;
                        $scope.webhook.form_id = undefined;
                        $scope.webhook.source_field_key = undefined;
                        $scope.webhook.destination_field_key = undefined;
                    }
                }
                $scope.formEnabled = !$scope.formEnabled;
            };

            $scope.deleteWebhook = function (webhook) {

                Notify.confirmDelete('notify.webhook.delete_question', {
                    webhook: webhook.display_name
                }).then(function () {
                    WebhookEndpoint.delete({ id: webhook.id }).$promise.then(function () {
                        Notify.notify('notify.webhook.destroy_success', {
                            webhook: webhook.display_name
                        });
                        $location.path($scope.whereToNext);
                    }, handleResponseErrors);
                });
            };
        }
    };
}];
