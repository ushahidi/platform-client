module.exports = [
    '$scope',
    '$rootScope',
    '$translate',
    'post',
    'ContactEndpoint',
    'CollectionEndpoint',
    'MessageEndpoint',
    'Notify',
    'UserEndpoint',
    '_',
function (
    $scope,
    $rootScope,
    $translate,
    post,
    ContactEndpoint,
    CollectionEndpoint,
    MessageEndpoint,
    Notify,
    UserEndpoint,
    _
) {

    $scope.post = post;
    $scope.publishedFor = function () {
        if ($scope.post.status === 'draft') {
            return 'post.publish_for_you';
        }
        if (!_.isEmpty($scope.post.published_to)) {
            return $scope.post.published_to.join(', ');
        }

        return 'post.publish_for_everyone';
    };

    if (post.contact.id) {
        MessageEndpoint.allInThread({ contact: post.contact.id })
            .$promise.then(function (messages) {
                $scope.messages = messages;
                _.each(messages, function (message, index) {
                    if (message.user) {
                        message.user = UserEndpoint.get({id: message.user.id});
                    }
                });
            });
    }

    // Set the page title
    $translate('post.message_thread').then(function (title) {
        $scope.title = title;
        $scope.$emit('setPageTitle', title);
    });

    ContactEndpoint.get({ id: $scope.post.contact.id })
        .$promise.then(function (contact) {
            $scope.contact = contact;
        });

    $scope.sendMessage = function () {

        var reply = {
            message: $scope.reply_text,
            direction: "outgoing",
            contact_id: $scope.post.contact.id,
            parent_id: $scope.messages[$scope.messages.length - 1].id
        };

        var request = MessageEndpoint.save(reply);

        request.$promise.then(function (response) {
            // for now, just get the messages again to update the page... but should ideally give
            // feedback and/or throw error if something went wrong

            MessageEndpoint.allInThread({ contact: $scope.post.contact.id })
                .$promise.then(function (updated_messages) {
                    $scope.messages = updated_messages;
                    $scope.reply_text = '';

                    $translate('notify.message.sent_to', {contact: $scope.contact.contact})
                    .then(function (message) {
                        Notify.showNotificationSlider(message);
                        $scope.form.$setPristine();
                    });

                }, function (errorResponse) {
                    Notify.showApiErrors(errorResponse);
                });
        });
    };

    $scope.refreshCollections = function () {
        $scope.editableCollections = CollectionEndpoint.editableByMe();
    };
    $scope.refreshCollections();
    $scope.postInCollection = function (collection) {
        return _.contains($scope.post.sets, String(collection.id));
    };

    $scope.toggleCreateCollection = function () {
        $scope.showNewCollectionInput = !$scope.showNewCollectionInput;
    };

    $scope.toggleCollection = function (selectedCollection) {
        if (_.contains($scope.post.sets, String(selectedCollection.id))) {
            $scope.removeFromCollection(selectedCollection);
        } else {
            $scope.addToCollection(selectedCollection);
        }
    };

    $scope.addToCollection = function (selectedCollection) {
        var collectionId = selectedCollection.id, collection = selectedCollection.name;

        CollectionEndpoint.addPost({'collectionId': collectionId, 'id': $scope.post.id})
            .$promise.then(function () {
                $translate('notify.collection.add_to_collection', {collection: collection})
                .then(function (message) {
                    $scope.post.sets.push(String(collectionId));
                    Notify.showNotificationSlider(message);
                });
            }, function (errorResponse) {
                Notify.showApiErrors(errorResponse);
            });
    };

    $scope.removeFromCollection = function (selectedCollection) {
        var collectionId = selectedCollection.id, collection = selectedCollection.name;

        CollectionEndpoint.removePost({'collectionId': collectionId, 'id': $scope.post.id})
        .$promise
        .then(function () {
            $translate('notify.collection.removed_from_collection', {collection: collection})
            .then(function (message) {
                $scope.post.sets = _.without($scope.post.sets, String(collectionId));
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
    $scope.createNewCollection = function (collectionName) {
        var collection = {
            'name': collectionName,
            'user_id': $rootScope.currentUser.userId
        };
        CollectionEndpoint.save(collection)
        .$promise
        .then(function (collection) {
            $scope.toggleCreateCollection();
            $scope.newCollection = '';
            $scope.refreshCollections();
            $scope.addToCollection(collection);
        }, function (errorResponse) {
            Notify.showApiErrors(errorResponse);
        });
    };

    $scope.publishPostTo = function (updatedPost) {
        // first check if stages required have been marked complete
        var requiredStages = _.where($scope.stages, {required: true}),
            errors = [];

        _.each(requiredStages, function (stage) {
            // if this stage isn't complete, add to errors
            if (_.indexOf($scope.post.completed_stages, stage.id) === -1) {
                errors.push($filter('translate')('post.modify.incomplete_step', { stage: stage.label }));
            }
        });

        if (errors.length) {
            Notify.showAlerts(errors);
            return;
        }

        $scope.post = updatedPost;

        PostEndpoint.update($scope.post).
        $promise
        .then(function () {
            var message = post.status === 'draft' ? 'notify.post.set_draft' : 'notify.post.publish_success';
            var role = message === 'draft' ? 'draft' : (_.isEmpty(post.published_to) ? 'everyone' : post.published_to.join(', '));
            $translate(message, {role: role})
            .then(function (message) {
                Notify.showNotificationSlider(message);
            });
        });
    };

    // END of mass c+p

}];
