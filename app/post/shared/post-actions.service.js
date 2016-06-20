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

            Notify.confirmDelete('notify.post.destroy_confirm').then(function () {
                PostEndpoint.delete({ id: post.id }).$promise.then(function () {
                    Notify.notify('notify.post.destroy_success', { name: post.title });
                    deferred.resolve();
                }, function (errorResponse) {
                    Notify.apiErrors(errorResponse);
                    deferred.reject(errorResponse);
                });
            });

            return deferred.promise;
        }
    };

    return Util.bindAllFunctionsToSelf(PostActionsService);
}];
