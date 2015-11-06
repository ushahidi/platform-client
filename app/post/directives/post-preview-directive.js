module.exports = [
    '$translate',
    '$q',
    'CollectionEndpoint',
    'TagEndpoint',
    'UserEndpoint',
    'FormEndpoint',
    'FormStageEndpoint',
    'RoleHelper',
    'Notify',
    '_',
function (
    $translate,
    $q,
    CollectionEndpoint,
    TagEndpoint,
    UserEndpoint,
    FormEndpoint,
    FormStageEndpoint,
    RoleHelper,
    Notify,
    _
) {
    var getCurrentStage = function (post) {
        var dfd = $q.defer();

        if (!post.form || !post.form.id) {
            // if there is no pre-defined structure in place (eg from SMS, stage is 'Structure'), and the
            // update link enables you to select a type of structure
            $translate('post.structure').then(dfd.resolve);
        } else {
            // Assume form is already loading/loaded
            FormStageEndpoint.query({formId: post.form.id}).$promise.then(function (stages) {
                // If number of completed stages matches number of stages, assume they're all complete
                if (post.completed_stages.length === stages.length) {
                    if (post.status === 'published') {
                        $translate('post.complete_published').then(dfd.resolve);
                    } else {
                        $translate('post.complete_draft').then(dfd.resolve);
                    }
                } else {
                    // Get incomplete stages
                    var incompleteStages = _.filter(stages, function (stage) {
                        return !_.contains(post.completed_stages, stage.id);
                    });

                    // Return lowest priority incomplete stage
                    dfd.resolve(incompleteStages[0].label);
                }
            });
        }

        return dfd.promise;
    };

    return {
        restrict: 'E',
        replace: true,
        scope: {
            post:  '=',
            canSelect: '='
        },
        templateUrl: 'templates/posts/preview.html',
        link: function (scope) {

            scope.getRoleDisplayName = RoleHelper.getRole;

            // Ensure completes stages array is numeric
            scope.post.completed_stages = scope.post.completed_stages.map(function (stageId) {
                return parseInt(stageId);
            });

            // Replace tags with full tag object
            scope.post.tags = scope.post.tags.map(function (tag) {
                return TagEndpoint.get({id: tag.id, ignore403: true});
            });

            // Replace form with full object
            if (scope.post.form) {
                FormEndpoint.get({id: scope.post.form.id}, function (form) {
                    scope.post.form = form;
                });
            }

            scope.addToCollection = function (selectedCollection) {
                var collectionId = selectedCollection.id, collection = selectedCollection.name;

                CollectionEndpoint.addPost({'collectionId': collectionId, 'id': scope.post.id})
                    .$promise.then(function () {
                        $translate('notify.collection.add_to_collection', {collection: collection})
                        .then(function (message) {
                            Notify.showNotificationSlider(message);
                        });
                        //Deselect post
                        scope.post.selected = false;
                    });
            };

            // determine which stage the post is at
            getCurrentStage(scope.post).then(function (currentStage) {
                scope.currentStage = currentStage;
            });
        }
    };

}];
