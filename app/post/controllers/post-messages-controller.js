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
    'PostEndpoint',
    '$filter',
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
    PostEndpoint,
    $filter,
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
            direction: 'outgoing',
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
        }, function (errorResponse) {
            Notify.showApiErrors(errorResponse);
        });
    };

}];
