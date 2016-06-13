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
        templateUrl: 'templates/posts/modify/post-editor.html',
        controller: PostEditorController
    };
}

PostEditorController.$inject = [
    '$scope',
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
    'Notify',
    '_',
    'PostActionsService'
  ];

function PostEditorController(
    $scope,
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
    Notify,
    _,
    PostActionsService
  ) {
    // Setup initial stages container

    $scope.everyone = $filter('translate')('post.modify.everyone');
    $scope.isEdit = !!$scope.post.id;
    $scope.validationErrors = [];
    $scope.visibleStage = 1;
    $scope.enableTitle = true;

    $scope.setVisibleStage = setVisibleStage;
    $scope.fetchAttributes = fetchAttributes;
    $scope.fetchStages = fetchStages;
    $scope.allowedChangeStatus = allowedChangeStatus;

    $scope.deletePost = deletePost;
    $scope.canSavePost = canSavePost;
    $scope.savePost = savePost;
    $scope.cancel = cancel;

    activate();

    function activate() {
        // Set bulk data import mode params
        if ($scope.postMode === 'bulk_data_import') {
            if (_.contains($scope.attributesToIgnore, 'title')) {
                $scope.enableTitle = false;
            }
        }

        $scope.post.form = $scope.form;
        $scope.fetchAttributes($scope.post.form.id);
        $scope.fetchStages($scope.post.form.id);
    }

    function setVisibleStage(stageId) {
        $scope.visibleStage = stageId;
    }

    function fetchAttributes(formId) {
        FormAttributeEndpoint.query({formId: formId}).$promise.then(function (attrs) {
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
                // @todo don't assign default when editing? or do something more sane
                if (!$scope.post.values[attr.key]) {
                    if (attr.input === 'location') {
                        $scope.post.values[attr.key] = [null];
                    } else if (attr.input === 'checkbox') {
                        $scope.post.values[attr.key] = [];
                    } else if (attr.input === 'number') {
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
                        $scope.post.values[attr.key][0] = moment($scope.post.values[attr.key][0]).utc();
                    }
                }
            });
            $scope.attributes = attributes;
        });
    }

    function fetchStages(formId) {
        FormStageEndpoint.query({ formId: formId }).$promise.then(function (stages) {
            var post = $scope.post;
            $scope.stages = stages;

            // If number of completed stages matches number of stages,
            // assume they're all complete, and just show the first stage
            if (post.completed_stages.length === stages.length) {
                $scope.setVisibleStage(stages[0].id);
            } else {
                // Get incomplete stages
                var incompleteStages = _.filter(stages, function (stage) {
                    return !_.contains(post.completed_stages, stage.id);
                });

                // Return lowest priority incomplete stage
                $scope.setVisibleStage(incompleteStages[0].id);
            }
        });
    }

    // TODO: this function should be moved to a general service handling permissions
    function allowedChangeStatus() {
        return $scope.post.allowed_privileges && $scope.post.allowed_privileges.indexOf('change_status') !== -1;
    }

    function canSavePost() {
        return PostEditService.canSavePost($scope.post, $scope.postForm, $scope.stages, $scope.attributes);
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

    function savePost() {
        if (!$scope.canSavePost()) {
            return;
        }

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
            var success_message = $scope.allowedChangeStatus() ? 'notify.post.save_success' : 'notify.post.save_success_review';

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

            Notify.apiErrors(validationErrors);

            $scope.saving_post = false;
        });
    }
}
