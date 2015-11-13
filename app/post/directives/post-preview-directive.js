module.exports = [
    '$translate',
    '$q',
    '$rootScope',
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
    $rootScope,
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
            canSelect: '=',
            editableCollections: '='
        },
        templateUrl: 'templates/posts/preview.html',
        link: function (scope) {
            scope.showNewCollectionInput = false;
            scope.newCollection = '';
            scope.getRoleDisplayName = RoleHelper.getRole;

            scope.editableByMeCopy = [];

            // Ensure completes stages array is numeric
            scope.post.completed_stages = scope.post.completed_stages.map(function (stageId) {
                return parseInt(stageId);
            });

            scope.toggleCreateCollection = function () {
                scope.showNewCollectionInput = !scope.showNewCollectionInput
            };

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

            scope.publishedFor = function () {
                if (!_.isEmpty(scope.post.published_to)) {
                    return RoleHelper.getRole(scope.post.published_to[0]);
                }

                return 'Everyone';
            };

            // TODO all collection code should be moved into a separate standalone widget
            scope.postInCollection = function (collection) {
                return _.contains(scope.post.sets, String(collection.id));
            };

            scope.toggleCollection = function (selectedCollection) {
                if (_.contains(scope.post.sets, String(selectedCollection.id))) {
                    scope.removeFromCollection(selectedCollection);
                } else {
                    scope.addToCollection(selectedCollection);
                }
            };

            scope.addToCollection = function (selectedCollection) {
                var collectionId = selectedCollection.id, collection = selectedCollection.name;

                CollectionEndpoint.addPost({'collectionId': collectionId, 'id': scope.post.id})
                    .$promise.then(function () {
                        $translate('notify.collection.add_to_collection', {collection: collection})
                        .then(function (message) {
                            scope.post.sets.push(String(collectionId));
                            Notify.showNotificationSlider(message);
                        });
                    }, function (errorResponse) {
                        Notify.showApiErrors(errorResponse);
                    });
            };

            scope.removeFromCollection = function (selectedCollection) {
                var collectionId = selectedCollection.id, collection = selectedCollection.name;

                CollectionEndpoint.removePost({'collectionId': collectionId, 'id': scope.post.id})
                    .$promise
                    .then(function () {
                        $translate('notify.collection.removed_from_collection', {collection: collection})
                        .then(function (message) {
                            scope.post.sets = _.without(scope.post.sets, String(collectionId));
                            Notify.showNotificationSlider(message);
                        });
                    }, function (errorResponse) {
                        Notify.showApiErrors(errorResponse);
                    });
            };
            /*
            scope.searchCollections = function (query) {
                CollectionEndpoint.query(query)
                .$promise
                .then(function (result) {
                }, function (errorResponse) {
                    Notify.showApiErrors(errorResponse);
                });
            };

            scope.clearSearch = function() {
              scope.editableCollection = scope.editableCollectionCopy;
            };
            */
            scope.createNewCollection = function (collectionName) {
                var collection = {
                    'name': collectionName,
                    'user_id': $rootScope.currentUser.userId
                };
                CollectionEndpoint.save(collection)
                .$promise
                .then(function (collection) {
                    scope.addToCollection(collection);
                    $rootScope.$broadcast('event:collection:update');
                    scope.newCollection = '';
                    scope.toggleCreateCollection();
                    refreshCollections();
                }, function (errorReponse) {
                    Notify.showApiErrors(errorResponse);
                });
            };

            // determine which stage the post is at
            getCurrentStage(scope.post).then(function (currentStage) {
                scope.currentStage = currentStage;
            });
        }
    };

}];
