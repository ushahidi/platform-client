module.exports = PostDataEditor;

PostDataEditor.$inject = [];

function PostDataEditor() {
    return {
        restrict: 'E',
        scope: {
            postContainer: '=',
            attributesToIgnore: '=',
            postMode: '=',
            editMode: '=',
            isLoading: '=',
            savingPost: '='
        },
        template: require('./post-data-editor.html'),
        controller: PostDataEditorController
    };
}

PostDataEditorController.$inject = [
    '$scope',
    '$rootScope',
    '$q',
    '$filter',
    '$location',
    '$translate',
    '$timeout',
    'moment',
    'PostEntity',
    'PostEndpoint',
    'PostLockEndpoint',
    'PostLockService',
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

function PostDataEditorController(
    $scope,
    $rootScope,
    $q,
    $filter,
    $location,
    $translate,
    $timeout,
    moment,
    postEntity,
    PostEndpoint,
    PostLockEndpoint,
    PostLockService,
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
    $scope.post = angular.copy($scope.postContainer.post);
    $scope.everyone = $filter('translate')('post.modify.everyone');
    $scope.isEdit = !!$scope.post.id;
    $scope.validationErrors = [];
    $scope.visibleStage = 1;
    $scope.enableTitle = true;
    $scope.setVisibleStage = setVisibleStage;
    $scope.loadData = loadData;
    $scope.allowedChangeStatus = allowedChangeStatus;
    $scope.deletePost = deletePost;
    $scope.canSavePost = canSavePost;
    $scope.savePost = savePost;
    $scope.cancel = cancel;
    $scope.postTitleLabel = 'Title';
    $scope.postDescriptionLabel = 'Description';
    $scope.tagKeys = [];
    $scope.save = $translate.instant('app.save');
    $scope.saving = $translate.instant('app.saving');
    $scope.submit = $translate.instant('app.submit');
    $scope.submitting = $translate.instant('app.submitting');
    $scope.hasPermission = $rootScope.hasPermission('Manage Posts');
    $scope.leavePost = leavePost;
    $scope.selectForm = selectForm;
    $rootScope.$on('event:edit:post:data:mode:save', function () {
        $scope.savePost();
    });

    $rootScope.$on('event:edit:leave:form', function () {
        if ($scope.postForm && $scope.postForm.$dirty) {
            $scope.leavePost();
        } else {
            $scope.cancel();
        }
    });

    $scope.$on('$locationChangeStart', function (e, next) {
        e.preventDefault();
        $scope.leavePost(next);
    });
    activate();

    function activate() {
        if ($scope.post.form) {
            $scope.selectForm();
        } else {
            $scope.isLoading.state = true;
            FormEndpoint.query().$promise.then(function (results) {
                $scope.forms = results;
                $scope.isLoading.state = false;

            });
        }

        $scope.medias = {};
        $scope.savingText = $translate.instant('app.saving');
        $scope.submittingText = $translate.instant('app.submitting');

        if ($scope.post.id) {
            PostLockService.createSocketListener();
        }
    }

    function setVisibleStage(stageId) {
        $scope.visibleStage = stageId;
    }
    function selectForm() {
        $scope.form = $scope.post.form;
        $scope.isLoading.state = true;
        $scope.loadData().then(function () {
            // Use $timeout to delay this check till after form fields are rendered.
            $timeout(() => {
                // If the post in marked as 'Published' but it is not in
                // a valid state to be saved as 'Published' warn the user
                if ($scope.post.status === 'published' && !canSavePost()) {
                    Notify.error('post.valid.invalid_state');
                }
            });
        });
    }

    function loadData() {

        var requests = [
            FormStageEndpoint.query({ formId: $scope.post.form.id }).$promise,
            FormAttributeEndpoint.query({ formId: $scope.post.form.id }).$promise,
            TagEndpoint.queryFresh().$promise
        ];

        // If existing Post attempt to acquire lock
        if ($scope.post.id) {
            requests.push(PostLockEndpoint.getLock({'post_id': $scope.post.id}).$promise);
        }

        return $q.all(requests).then(function (results) {

            if ($scope.post.id && !results[3]) {
                // Failed to get a lock
                // Bounce user back to the detail page where admin/manage post perm
                // have the option to break the lock
                $scope.editMode.editing = false;
                return;
            }


            var post = $scope.post;
            var tasks = _.sortBy(results[0], 'priority');
            var attrs = _.chain(results[1])
                .sortBy('priority')
                .value();
            var categories = results[2];

            // Set Post Lock
            $scope.post.lock = results[3];

            // If attributesToIgnore is set, remove those attributes from set of fields to display
            var attributes = [];
            _.each(attrs, function (attr) {
                if (attr.type === 'title' || attr.type === 'description') {
                    if (attr.type === 'title') {
                        $scope.postTitleLabel = attr.label;
                        $scope.postTitleInstructions = attr.instructions;
                    }
                    if (attr.type === 'description') {
                        $scope.postDescriptionLabel = attr.label;
                        $scope.postDescriptionInstructions = attr.instructions;
                    }
                } else {
                    attributes.push(attr);
                }
            });

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
                if (attr.input === 'tags') {
                    // adding category-objects attribute-options
                    attr.options = _.chain(attr.options)
                        .map(function (category) {
                            return _.findWhere(categories, {id: category});
                        })
                        .filter()
                        .value();
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
                } else if (attr.input === 'tags') {
                    // tag.id needs to be a number
                    if ($scope.post.values[attr.key]) {
                        $scope.post.values[attr.key] = $scope.post.values[attr.key].map(function (id) {
                            return parseInt(id);
                        });
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
            $scope.isLoading.state = false;
        });

    }

    function canSavePost() {
        return PostEditService.validatePost($scope.post, $scope.postForm, $scope.tasks);
    }

    function cancel(url) {
        $scope.isLoading.state = false;
        $scope.savingPost.saving = false;
        PostLockEndpoint.unlock({
            id: $scope.post.lock.id,
            post_id: $scope.post.id
        }).$promise.then(function (result) {
            $scope.editMode.editing = false;
            // redirecting if user is leaving page
            if (url) {
                $location.path(url);
            }
        });
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

    function leavePost(url) {
        Notify.confirmLeave('notify.post.leave_without_save').then(function () {
            $scope.isLoading.state = false;
            $scope.savingPost.saving = false;
            $scope.cancel(url);
        }, function () {
            // redirecting if user is leaving the page
            if (url) {
                $location.path(url);
            }
        });
    }

    function savePost() {
        $scope.isLoading.state = true;
        $scope.savingPost.saving = true;
        // Checking if changes are made
        if ($scope.postForm && !$scope.postForm.$dirty) {
            $scope.savingPost.saving = false;
            $scope.isLoading.state = false;
            Notify.infoModal('post.valid.no_changes');

            return;
        }

        if (!$scope.canSavePost()) {
            Notify.error('post.valid.validation_fail');
            $scope.savingPost.saving = false;
            $scope.isLoading.state = false;
            return;
        }
        // Create/update any associated media objects
        // Media creation must be completed before we can progress with saving
        resolveMedia().then(function () {

            // Avoid messing with original object
            // Clean up post values object
            if ('message_location' in $scope.post.values) {
                $scope.post.values.message_location = [];
            }
            var post = PostEditService.cleanPostValues(angular.copy($scope.post));

            // adding neccessary tags to post.tags, needed for filtering
            if ($scope.tagKeys.length > 0) {
                post.tags = _.chain(post.values)
                .pick($scope.tagKeys) // Grab just the 'tag' fields        { key1: [0,1], key2: [1,2], key3: undefined }
                .values()             // then take their values            [ [0,1], [1,2], undefined ]
                .flatten()            // flatten them into a single array  [0,1,1,2,undefined]
                .filter()             // Remove nulls                      [0,1,1,2]
                .uniq()               // Remove duplicates                 [0,1,2]
                .value();             // and output
            }
            var request;
            if (post.id) {
                request = PostEndpoint.update(post);
            } else {
                request = PostEndpoint.save(post);
            }
            request.$promise.then(function (response) {
                var success_message = (response.status && response.status === 'published') ? 'notify.post.save_success' : 'notify.post.save_success_review';
                $scope.postContainer.post = $scope.post;
                if (response.id && response.allowed_privileges.indexOf('read') !== -1) {
                    $scope.savingPost.saving = false;
                    $scope.post.id = response.id;
                    Notify.notify(success_message, { name: $scope.post.title });
                    $scope.editMode.editing = false;
                } else {
                    Notify.notify(success_message, { name: $scope.post.title });
                    $scope.editMode.editing = false;
                }
                $scope.isLoading.state = false;
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
                    $scope.isLoading.state = false;
                });
                Notify.errors(_.pluck(validationErrors, 'message'));
                $scope.isLoading.state = false;
                $scope.savingPost.saving = false;
            });
        });
    }
}
