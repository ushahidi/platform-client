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
    '$filter',
    '$location',
    '$translate',
    'PostLockEndpoint',
    'PostEditService',
    'Notify',
    '_',
    'PostActionsService',
    'MediaEditService',
    '$state',
    '$transitions',
    'LoadingProgress',
    'SurveysSdk',
    'TranslationService',
    'PostsSdk',
    'moment'
];
function PostDataEditorController(
    $scope,
    $rootScope,
    $filter,
    $location,
    $translate,
    PostLockEndpoint,
    PostEditService,
    Notify,
    _,
    PostActionsService,
    MediaEditService,
    $state,
    $transitions,
    LoadingProgress,
    SurveysSdk,
    TranslationService,
    PostsSdk,
    moment
    ) {

    // Setup initial stages container
    $scope.everyone = $filter('translate')('post.modify.everyone');
    $scope.post = $scope.post.data.result;
    $scope.validationErrors = [];
    $scope.enableTitle = true;
    $scope.getLock = getLock;
    $scope.allowedChangeStatus = allowedChangeStatus;
    $scope.deletePost = deletePost;
    $scope.canSavePost = canSavePost;
    $scope.savePost = savePost;
    $scope.save = $translate.instant('app.save');
    $scope.saving = $translate.instant('app.saving');
    $scope.cancel = cancel;
    $scope.submit = $translate.instant('app.submit');
    $scope.submitting = $translate.instant('app.submitting');
    $scope.hasPermission = $rootScope.hasPermission('Manage Posts');
    $scope.loadData = loadData;
    $scope.isSaving = LoadingProgress.getSavingState;
    $scope.removeLanguage = removeLanguage;
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
    $rootScope.$on('event:translations:languageAdded', function() {
        // Need to wait for the form to be initiated before setting it dirty.
        $scope.$watch('editForm', function() {
            // Setting the form dirty if a new language is added. This is to detect changes when saving.
            $scope.editForm.$setDirty();
        });
    });

    activate();

    function activate() {
        if ($scope.post.form_id) {
            SurveysSdk.getSurveys($scope.post.form_id).then(result => {
                $scope.loadData(result);
            });

        } else {
            SurveysSdk.getSurveys().then(forms => {
                $scope.forms = forms;
                $scope.$apply();
            });
        }
        $scope.medias = {};
        $scope.savingText = $translate.instant('app.saving');
        $scope.submittingText = $translate.instant('app.submitting');
    }

    function loadData(form) {
        $scope.post.form = form;
        $scope.getLock();
        $scope.post.translations = Object.assign({}, $scope.post.translations);
        if (!$scope.post.enabled_languages) {
            $scope.post.enabled_languages = {default: '', available: []};
        }
        $scope.languages = {default: $scope.post.enabled_languages.default, available: $scope.post.enabled_languages.available, active: $scope.post.enabled_languages.default, surveyLanguages:[$scope.post.form.enabled_languages.default, ...$scope.post.form.enabled_languages.available]};

        if (!$scope.post.post_content) {
            $scope.post.post_content = $scope.post.form.tasks;
        }
            // Initialize values on empty post-fields
            $scope.post.post_content.map(task => {
                task.fields.map (attr => {
                    if (attr.type !== 'tags') {
                        if (!attr.value) {
                            attr.value = {};
                        }
                    if (!attr.value.translations) {
                        attr.value.translations = {};
                    } else {
                        attr.value.translations = Object.assign({}, attr.value.translations);
                    }
                    // Create associated media entity
                    if (attr.input === 'upload') {
                        $scope.medias[attr.id] = {};
                    }
                    if (attr.type === 'decimal') {
                        if (attr.value.value) {
                            attr.value.value = parseFloat(attr.value.value);
                        } else if (attr.default) {
                            attr.value.value = parseFloat(attr.default);
                        }
                    }
                    if (attr.type === 'int') {
                        if (attr.value.value) {
                            attr.value.value = parseInt(attr.value.value);
                        } else if (attr.default) {
                            attr.value.value = parseInt(attr.default);
                        }
                    }

                    if (attr.input === 'date' || attr.input === 'datetime') {
                        // Date picker requires date object
                        // ensure that dates are preserved in UTC
                        if (attr.value.value) {
                            attr.value.value = moment(attr.value.value).toDate();
                        } else if (attr.default) {
                            attr.value.value = new Date(attr.default);
                        } else {
                            attr.value.value = attr.required ? moment(new Date()).toDate() : null;
                        }
                    }
                }
            });
        });
        if ($scope.post.status === 'published' && !canSavePost()) {
            Notify.error('post.valid.invalid_state');
        }
    }

    function getLock() {
        PostLockEndpoint.getLock({'post_id': $scope.post.id}).$promise.then(function (lock) {
            if ($scope.post.id && !lock) {
                // Failed to get a lock
                // Bounce user back to the detail page where admin/manage post perm
                // have the option to break the lock
                $state.go('posts.data.detail', {view: 'data', postId: $scope.post.id});
                return;
            }
            // Set Post Lock
            $scope.post.lock = lock;
        });
    }

    function canSavePost() {
        return PostEditService.validatePost($scope.post, $scope.editForm, $scope.post.post_content);
    }
    //TODO: Use sdk
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
            let post = PostEditService.cleanTagValues(angular.copy($scope.post));
            PostsSdk.savePost(post).then(function (response) {
                var success_message = (response.status && response.status === 'published') ? 'notify.post.save_success' : 'notify.post.save_success_review';
                $scope.editForm.$dirty = false;
                // Save the updated post back to outside context
                ignoreCancelEvent = true;
                $state.go('posts.data.detail', {view: 'data', postId: response.data.result.id});

                Notify.notify(success_message, { name: $scope.post.title });

                // adding post to broadcast to make sure it gets filtered out from post-list if it does not match the filters.
                $rootScope.$broadcast('event:edit:post:data:mode:saveSuccess', {post: response});
            }, function (errorResponse) { // errors
                Notify.sdkErrors(errorResponse);
                $rootScope.$broadcast('event:edit:post:data:mode:saveError');

            });
        });
    }
    function removeLanguage(index, language) {
            Notify.confirmModal('Are you sure you want to remove this language and all the translations?','','','','Remove language', 'cancel')
            .then(function() {
                // Setting form dirty so we can detect changes upon save.
                $scope.editForm.$setDirty();
                $scope.languages.active = $scope.languages.default;
                $scope.languages.available.splice(index, 1);
                delete $scope.post.translations[language];
                _.each($scope.post.post_content, task => {
                    _.each(task.fields, field => {
                        delete field.value.translations[language];
                    });
                });
            });
        };

    function cancel() {
        $state.go('posts.data.detail',{postId: $scope.post.id});
    }
}
