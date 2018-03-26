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
        },
        getStatuses: function () {
            return ['published', 'draft', 'archived'];
        },
        filterPostEditorCategories: function (attributeOptions, categories) {
            // adding category-objects attribute-options
            return _.chain(attributeOptions)
                .map((category) => {
                    const ret = angular.copy(_.findWhere(categories, {id: category}));
                    if (ret && ret.children.length > 0) {
                        ret.children = _.chain(ret.children)
                            .map((child) => {
                                if (attributeOptions.find((o) => o === child.id)) {
                                    return _.findWhere(categories, {id: child.id});
                                }
                            })
                            .filter()
                            .value();
                    }
                    return ret;
                })
                .filter()
                .value();
        }
    };

    return Util.bindAllFunctionsToSelf(PostActionsService);
}];
