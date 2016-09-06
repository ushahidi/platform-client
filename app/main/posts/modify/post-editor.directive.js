module.exports = PostEditor;

PostEditor.$inject = [];

function PostEditor() {
    return {
        restrict: 'E',
        scope: {
            post: '=',
            attributesToIgnore: '=',
            form: '=',
            postMode: '='
        },
        template: require('./post-editor.html'),
        controller: PostEditorController
    };
}

PostEditorController.$inject = [
    '$scope',
    '$q',
    '$filter',
    '$location',
    '$translate',
    'moment',
    'PostEntity',
    'PostEndpoint',
    'PostEditService',
    'FormEndpoint',
    'FormStageEndpoint',
    'FormAttributeEndpoint',
    'UserEndpoint',
    'TagEndpoint',
    'Notify',
    '_',
    'PostActionsService',
    'MediaEditService'
  ];

function PostEditorController(
    $scope,
    $q,
    $filter,
    $location,
    $translate,
    moment,
    postEntity,
    PostEndpoint,
    PostEditService,
    FormEndpoint,
    FormStageEndpoint,
    FormAttributeEndpoint,
    UserEndpoint,
    TagEndpoint,
    Notify,
    _,
    PostActionsService,
    MediaEditService
  ) {

    // Setup initial stages container
    $scope.everyone = $filter('translate')('post.modify.everyone');
    $scope.isEdit = !!$scope.post.id;
    $scope.validationErrors = [];
    $scope.visibleStage = 1;
    $scope.enableTitle = true;

    $scope.setVisibleStage = setVisibleStage;
    $scope.fetchAttributesAndTasks = fetchAttributesAndTasks;

    $scope.allowedChangeStatus = allowedChangeStatus;


    $scope.deletePost = deletePost;
    $scope.canSavePost = canSavePost;
    $scope.savePost = savePost;
    $scope.cancel = cancel;

    activate();

    function activate() {
        TagEndpoint.query().$promise.then(function (results) {
            $scope.categories = results;
        });

        $scope.post.form = $scope.form;
        $scope.fetchAttributesAndTasks($scope.post.form.id)
        .then(function () {
            // If the post in marked as 'Published' but it is not in
            // a valid state to be saved as 'Published' warn the user
            if ($scope.post.status === 'published' && !canSavePost()) {
                Notify.error('post.valid.invalid_state');
            }
        });
        $scope.medias = {};
    }

    function setVisibleStage(stageId) {
        $scope.visibleStage = stageId;
    }

    function fetchAttributesAndTasks(formId) {
        return $q.all([
            FormStageEndpoint.query({ formId: formId }).$promise,
            FormAttributeEndpoint.query({ formId: formId }).$promise
        ]).then(function (results) {
            var post = $scope.post;
            var tasks = _.sortBy(results[0], 'priority');
            var attrs = _.chain(results[1])
                .sortBy('priority')
                .value();

            // If attributesToIgnore is set, remove those attributes from set of fields to display
            var attributes = [];
            _.each(attrs, function (attr) {
                if (!_.contains($scope.attributesToIgnore, attr.key)) {
                    attributes.push(attr);
                }
            });
            attributes = (attributes.length) ? attributes : attrs;

            // Initialize values on post (helps avoid madness in the template)
            attributes.map(function (attr) {
                // Create associated media entity
                if (attr.input === 'upload') {
                    var media = {};
                    if ($scope.post.values[attr.key]) {
                        media = $scope.post.values[attr.key][0];
                    }
                    $scope.medias[attr.key] = {};
                }
                // @todo don't assign default when editing? or do something more sane
                if (!$scope.post.values[attr.key]) {
                    if (attr.input === 'location') {
                        // Prepopulate location fields from message location
                        if ($scope.post.values.message_location) {
                            $scope.post.values[attr.key] = angular.copy($scope.post.values.message_location);
                        } else {
                            $scope.post.values[attr.key] = [null];
                        }
                    }  else if (attr.input === 'number') {
                        $scope.post.values[attr.key] = [parseInt(attr.default)];
                    } else if (attr.input === 'date' || attr.input === 'datetime') {
                        $scope.post.values[attr.key] = attr.default ? [new Date(attr.default)] : [new Date()];
                    } else {
                        $scope.post.values[attr.key] = [attr.default];
                    }
                } else if (attr.input === 'date' || attr.input === 'datetime') {
                    // Date picker requires date object
                    // ensure that dates are preserved in UTC
                    if ($scope.post.values[attr.key][0]) {
                        $scope.post.values[attr.key][0] = moment($scope.post.values[attr.key][0]).toDate();
                    }
                } else if (attr.input === 'number') {
                    // Number input requires a number
                    if ($scope.post.values[attr.key][0]) {
                        $scope.post.values[attr.key][0] = parseFloat($scope.post.values[attr.key][0]);
                    }
                }
            });

            _.each(tasks, function (task) {
                task.attributes = _.filter(attributes, function (attribute) {
                    return attribute.form_stage_id === task.id;
                });
            });

            // If number of completed stages matches number of tasks - not including Post,
            // assume they're all complete, and just show the first task
            if (post.completed_stages.length === tasks.length - 1 && tasks.length > 1) {
                $scope.setVisibleStage(tasks[1].id);
            } else {
                // Get incomplete stages
                var incompleteStages = _.filter(tasks, function (task) {
                    return !_.contains(post.completed_stages, task.id);
                });

                // Return lowest priority incomplete task - not including post
                incompleteStages.length > 1 ? $scope.setVisibleStage(incompleteStages[1].id) : '';
            }
            $scope.tasks = tasks;
        });
    }

    function canSavePost() {
        return PostEditService.validatePost($scope.post, $scope.postForm, $scope.tasks);
    }

    function cancel() {

        var path = $scope.post.id ? '/posts/' + $scope.post.id : '/';
        $location.path(path);
    }

    function deletePost(post) {
        PostActionsService.delete(post).then(function () {
            $location.path('/');
        });
    }

    function allowedChangeStatus() {
        return $scope.post.allowed_privileges && $scope.post.allowed_privileges.indexOf('change_status') !== -1;
    }

    function resolveMedia() {
        return MediaEditService.saveMedia($scope.medias, $scope.post);
    }

    function savePost() {
        if (!$scope.canSavePost()) {
            Notify.error('post.valid.validation_fail');
            return;
        }

        // Create/update any associated media objects
        // Media creation must be completed before we can progress with saving
        resolveMedia().then(function () {

            $scope.saving_post = true;

            // Avoid messing with original object
            // Clean up post values object
            var post = PostEditService.cleanPostValues(angular.copy($scope.post));
            var request;
            if (post.id) {
                request = PostEndpoint.update(post);
            } else {
                request = PostEndpoint.save(post);
            }

            request.$promise.then(function (response) {
                var success_message = (response.status && response.status === 'published') ? 'notify.post.save_success' : 'notify.post.save_success_review';

                if (response.id && response.allowed_privileges.indexOf('read') !== -1) {
                    $scope.saving_post = false;
                    $scope.post.id = response.id;
                    Notify.notify(success_message, { name: $scope.post.title });
                    $location.path('/posts/' + response.id);
                } else {
                    Notify.notify(success_message, { name: $scope.post.title });
                    $location.path('/');
                }
            }, function (errorResponse) { // errors
                var validationErrors = [];
                // @todo refactor limit handling
                _.each(errorResponse.data.errors, function (value, key) {
                    // Ultimately this should check individual status codes
                    // for the moment just check for the message we expect
                    if (value.title === 'limit::posts') {
                        Notify.limit('limit.post_limit_reached');
                    } else {
                        validationErrors.push(value);
                    }
                });

                Notify.errors(_.pluck(validationErrors, 'message'));

                $scope.saving_post = false;
            });
        });
    }
}
