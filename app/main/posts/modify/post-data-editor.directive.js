module.exports = PostDataEditor;

PostDataEditor.$inject = [];

function PostDataEditor() {
    return {
        restrict: 'E',
        scope: {
            post: '<'
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
    'MediaEditService',
    '$state',
    '$transitions',
    'LoadingProgress'
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
    MediaEditService,
    $state,
    $transitions,
    LoadingProgress
  ) {

    // Setup initial stages container
    $scope.everyone = $filter('translate')('post.modify.everyone');

    $scope.validationErrors = [];
    $scope.visibleStage = 1;
    $scope.enableTitle = true;
    $scope.setVisibleStage = setVisibleStage;
    $scope.loadData = loadData;
    $scope.allowedChangeStatus = allowedChangeStatus;
    $scope.deletePost = deletePost;
    $scope.canSavePost = canSavePost;
    $scope.savePost = savePost;
    $scope.tagKeys = [];
    $scope.save = $translate.instant('app.save');
    $scope.saving = $translate.instant('app.saving');
    $scope.submit = $translate.instant('app.submit');
    $scope.submitting = $translate.instant('app.submitting');
    $scope.hasPermission = $rootScope.hasPermission('Manage Posts');
    $scope.selectForm = selectForm;
    $scope.isSaving = LoadingProgress.getSavingState;

    $scope.cancel = function () {
        $location.path('/views/data');
    };

    var ignoreCancelEvent = false;
    // Need state management
    $scope.$on('event:edit:post:reactivate', function () {
        activate();
    });

    $scope.$on('event:edit:post:data:mode:save', function () {
        $scope.savePost();
    });

    /**
     * $transitions.onStart is a handler for when a transition starts.
     * When a transition starts here you want to either let it go or cancel it here,
     * because you need the leavePost functionality with the warning modal and all that.
     * The ignoreCancelEvent bool is for a special case where you literally are transitioning after the user accepts
     * (you don't want to show it again) and you have the transition.from().name making sure you were in a posts.data.edit state
     * (editing mode). If you are there, you either resolve or reject a promise depending on form state, user actions, etc.
     * Resolve will let the transition continue. Reject will stop the transition meaning you stay in the edit mode
     */
    let unbindOnStart = $transitions.onStart({}, function (transition) {
        //where is it going? transition.to().name
        // return rejected promise or false to cancel the transition
        // saveChangesAndContinue calls cancel which then resolves or rejects the state change.
        if (!ignoreCancelEvent && transition.from().name === 'posts.data.edit') {
            return saveChangesAndContinue();
        }
        return true;
    });
    $scope.$on('$destroy', () => {
        unbindOnStart();
    });

    /**
     *
     * @returns {Promise}
     */
    function unlockPost() {
        return new Promise(function (resolve, reject) {
            /** @DEVNOTE I think we shouldn't need to check this,
             * but in unstructured posts the lock is not available consistently.
             **/
            if ($scope.post.lock) {
                PostLockEndpoint.unlock({
                    post_id: $scope.post.id
                }).$promise.then(resolve, reject);
            } else {
                return reject();
            }
        });
    }

    /**
     * This function is called when the user attempts to leave the post edit form.
     * - No changes: resolve and let the transition out of it continue
     * - There are Changes: warn the user they will lose data if they don't save
     * -  - Continue with no saving: let the transition continue (resolve)
     * -  - Cancel button with no saving: let the transition continue (resolve)
     * - - Save success:  let the transition continue (resolve)
     * - - Save failure: cancel the transition, show errors or whatever the save post does.
     */
    function saveChangesAndContinue() {
        return new Promise (function (resolve, reject) {
            // Do we have unsaved changes? If not , leave them continue
            if (!$scope.editForm || ($scope.editForm && !$scope.editForm.$dirty)) {
                unlockPost().then(resolve, resolve); // Resolve even if unlock fails
            } else {
                // @uirouter-refactor if we end up having onbeforeunload features,we need to add this back
                // if (ev) {
                //     ev.preventDefault();
                // }
                Notify.confirmLeave('notify.post.leave_without_save').then(function () {
                    // continue without saving goes here,
                    // save goes here too, because it's a RESOLVE.
                    unlockPost().then(resolve, resolve); // Resolve even if unlock fails
                }, function () {
                    // when reject, we should not change state/transition. This happens in save errors
                    reject();
                });
            }
        });
    }

    activate();

    function activate() {
        if ($scope.post.form) {
            $scope.selectForm();
        } else {
            FormEndpoint.queryFresh().$promise.then(function (results) {
                $scope.forms = results;
            });
        }
        $scope.medias = {};
        $scope.savingText = $translate.instant('app.saving');
        $scope.submittingText = $translate.instant('app.submitting');

    }

    function setVisibleStage(stageId) {
        $scope.visibleStage = stageId;
    }
    function selectForm() {
        $scope.form = $scope.post.form;
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
            FormStageEndpoint.queryFresh({ formId: $scope.post.form.id }).$promise,
            FormAttributeEndpoint.queryFresh({ formId: $scope.post.form.id }).$promise,
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
                $state.go('posts.data.detail', {view: 'data', postId: $scope.post.id});
                return;
            }

            var post = $scope.post;
            var tasks = _.sortBy(results[0], 'priority');
            var attributes = _.chain(results[1])
                .sortBy('priority')
                .value();
            var categories = results[2];

            // Set Post Lock
            $scope.post.lock = results[3];

            // Initialize values on post (helps avoid madness in the template)
            attributes.map(function (attr) {
                // Create associated media entity
                if (attr.input === 'upload') {
                    $scope.medias[attr.key] = {};
                }
                if (attr.input === 'tags') {
                    // adding category-objects attribute-options
                    attr.options = PostActionsService.filterPostEditorCategories(attr.options, categories);
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
        });

    }

    function canSavePost() {
        return PostEditService.validatePost($scope.post, $scope.editForm, $scope.tasks);
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
        // Checking if changes are made
        if ($scope.editForm && !$scope.editForm.$dirty) {
            Notify.infoModal('post.valid.no_changes');
            $rootScope.$broadcast('event:edit:post:data:mode:saveError');
            return;
        }

        if (!$scope.canSavePost()) {
            Notify.error('post.valid.validation_fail');
            $rootScope.$broadcast('event:edit:post:data:mode:saveError');
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
                $scope.editForm.$dirty = false;
                // Save the updated post back to outside context
                ignoreCancelEvent = true;
                $state.go('posts.data.detail', {view: 'data', postId: response.id});

                // DEVNOTE: Not sure how this would ever happen in the case of data view
                // ideally this will go away when the two editors are integrated
                // This is not currently relevant to the data view directive
                // if data view becomes capable of creating Posts this will need to be changed
                // as it will not currently prevent display of the Post

                if (response.id && response.allowed_privileges.indexOf('read') !== -1) {
                    $scope.post.id = response.id;
                }

                Notify.notify(success_message, { name: $scope.post.title });

                // adding post to broadcast to make sure it gets filtered out from post-list if it does not match the filters.
                $rootScope.$broadcast('event:edit:post:data:mode:saveSuccess', {post: response});
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
                $rootScope.$broadcast('event:edit:post:data:mode:saveError');

            });
        });
    }
}
