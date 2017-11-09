module.exports = [
    '$scope',
    '$rootScope',
    '$q',
    '$filter',
    '$location',
    '$stateParams',
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
function PostDataEditorController(
    $scope,
    $rootScope,
    $q,
    $filter,
    $location,
    $stateParams,
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
    $scope.cancel = cancel;
    $scope.postTitleLabel = 'Title';
    $scope.postDescriptionLabel = 'Description';
    $scope.post = $scope.$resolve.post;
    $scope.tagKeys = [];
    $scope.save = $translate.instant('app.save');
    $scope.saving = $translate.instant('app.saving');
    $scope.submit = $translate.instant('app.submit');
    $scope.submitting = $translate.instant('app.submitting');
    $scope.hasPermission = $rootScope.hasPermission('Manage Posts');
    $scope.leavePost = leavePost;
    $scope.selectForm = selectForm;

    // Need state management
    $scope.$on('event:edit:post:reactivate', function () {
        activate();
    });

    $scope.$on('event:edit:post:data:mode:save', function () {
        $scope.savePost();
    });

    $scope.$on('event:edit:leave:form', function () {
        if ($scope.parentForm.form && $scope.parentForm.form.$dirty) {
            $scope.leavePost();
        } else {
            $scope.cancel();
        }
    });

    var $locationChangeStartHandler = $scope.$on('$locationChangeStart', function (e, next) {
        $scope.leavePost(next, e);
    });
    activate();

    function activate() {
        //$scope.post = angular.copy($scope.postContainer.post);
        //$scope.editMode.editing = true;
        if ($scope.post.form) {
            $scope.selectForm();
        } else {
            $scope.isLoading.state = true;
            FormEndpoint.queryFresh().$promise.then(function (results) {
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

    /**
     * redirecting if user is leaving the page, but only changing the URL and not the actual page if the user
     * is navigation between posts.
     * @FIXME This is a very fragile and not an ideal way to handle it. But since we are faking URLs we can't rely only on
     * routePrams or only on the location, I think, so we are going to use this for the moment
     */
    function doChangePage(url) {

        leaveEditMode();
        signalLeaveComplete();

        if (!url) {
            return;
        }
        var locationMatch = url.match(/\/posts\/[0-9]+(\/|$)/);
        var locationIsPost =  locationMatch ? locationMatch.length > 0 : false;
        var movingToDataPost = ($stateParams.view === 'data' && locationIsPost);

        if (url &&  !(movingToDataPost)) {
            //@uirouter-refactor $location.path(url.replace($location.$$absUrl.replace($location.$$url, ''), ''));
            //@uirouter-refactor $locationChangeStartHandler();
        } else if (movingToDataPost) {
            //@uirouter-refactor $location.path(url.match(/\/posts\/[0-9]+(\/|$)/)[0]);
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
                leaveEditMode();
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
        return PostEditService.validatePost($scope.post, $scope.parentForm.form, $scope.tasks);
    }

    function cancel(url) {
        $scope.isLoading.state = false;
        $scope.savingPost.saving = false;
        /** @DEVNOTE I think we shouldn't need to check this,
         * but in unstructured posts the lock is not available consistently.
        **/
        if ($scope.post.lock) {
            PostLockEndpoint.unlock({
                id: $scope.post.lock.id,
                post_id: $scope.post.id
            }).$promise.then(function (result) {
                doChangePage(url);
            });
        } else {
            doChangePage(url);
        }
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

    function leaveEditMode() {
        $scope.editMode.editing = false;
    }

    function signalLeaveComplete() {
        $rootScope.$broadcast('event:edit:leave:form:complete');
    }

    function leavePost(url, ev) {
        if ($scope.parentForm.form && !$scope.parentForm.form.$dirty) {
            leaveEditMode();
            $scope.isLoading.state = false;
            $scope.savingPost.saving = false;
            $scope.cancel(url);
        } else {
            if (ev) {
                ev.preventDefault();
            }
            Notify.confirmLeave('notify.post.leave_without_save').then(function () {
                $scope.isLoading.state = false;
                $scope.savingPost.saving = false;
                $scope.cancel(url);
            }, function () {
                $scope.isLoading.state = false;
                $scope.savingPost.saving = false;
                $scope.cancel(url);
            });
        }
    }

    function savePost() {
        $scope.isLoading.state = true;
        $scope.savingPost.saving = true;
        // Checking if changes are made
        if ($scope.parentForm.form && !$scope.parentForm.form.$dirty) {
            $scope.savingPost.saving = false;
            $scope.isLoading.state = false;
            Notify.infoModal('post.valid.no_changes');
            $rootScope.$broadcast('event:edit:post:data:mode:saveError');
            return;
        }

        if (!$scope.canSavePost()) {
            Notify.error('post.valid.validation_fail');
            $scope.savingPost.saving = false;
            $scope.isLoading.state = false;
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

                // Save the updated post back to outside context
                $scope.postContainer.post = response;

                // DEVNOTE: Not sure how this would ever happen in the case of data view
                // ideally this will go away when the two editors are integrated
                // This is not currently relevant to the data view directive
                // if data view becomes capable of creating Posts this will need to be changed
                // as it will not currently prevent display of the Post

                if (response.id && response.allowed_privileges.indexOf('read') !== -1) {
                    $scope.post.id = response.id;
                }

                $scope.savingPost.saving = false;
                Notify.notify(success_message, { name: $scope.post.title });

                $scope.isLoading.state = false;
                // adding post to broadcast to make sure it gets filtered out from post-list if it does not match the filters.
                $rootScope.$broadcast('event:edit:post:data:mode:saveSuccess', {post: response});

                leaveEditMode();
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
                $rootScope.$broadcast('event:edit:post:data:mode:saveError');

            });
        });
    }
}];
