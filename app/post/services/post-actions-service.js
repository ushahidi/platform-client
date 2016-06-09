module.exports = [
    '_',
    'Util',
    '$translate',
    'PostEndpoint',
    'Notify',
    '$q',
function (
    _,
    Util,
    $translate,
    PostEndpoint,
    Notify,
    $q
) {
    var PostActionsService = {
        delete: function (post) {
            var deferred = $q.defer();

            $translate('notify.post.destroy_confirm').then(function (message) {
                Notify.showConfirmModal(message, false, 'Delete', 'delete').then(function () {
                    PostEndpoint.delete({ id: post.id }).$promise.then(function () {
                        $translate(
                            'notify.post.destroy_success',
                            {
                                name: post.title
                            }
                        ).then(function (message) {
                            Notify.showNotificationSlider(message);
                            deferred.resolve();
                        });
                    }, function (errorResponse) {
                        Notify.showApiErrors(errorResponse);
                        deferred.reject(errorResponse);
                    });
                });
            });

            return deferred.promise;
        }
    };

    return Util.bindAllFunctionsToSelf(PostActionsService);
}];
