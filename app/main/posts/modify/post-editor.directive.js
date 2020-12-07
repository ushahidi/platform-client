module.exports = PostEditor;

PostEditor.$inject = [];

function PostEditor() {
    return {
        restrict: 'E',
        scope: {
            post: '=',
            formId: '='
        },
        template: require('./post-editor.html'),
        controller: PostEditorController
    };
}

PostEditorController.$inject = [
    '$scope',
    '$q',
    '$filter',
    '$translate',
    '$timeout',
    'moment',
    'PostEditService',
    'Notify',
    '_',
    'PostActionsService',
    'MediaEditService',
    '$state',
    'SurveysSdk',
    'TranslationService',
    'CategoriesSdk',
    'PostsSdk'
  ];

function PostEditorController(
    $scope,
    $q,
    $filter,
    $translate,
    $timeout,
    moment,
    PostEditService,
    Notify,
    _,
    PostActionsService,
    MediaEditService,
    $state,
    SurveysSdk,
    TranslationService,
    CategoriesSdk,
    PostsSdk
  ) {

    // Setup initial stages container
    $scope.everyone = $filter('translate')('post.modify.everyone');
    $scope.validationErrors = [];
    $scope.enableTitle = true;
    $scope.loadData = loadData;
    $scope.canSavePost = canSavePost;
    $scope.savePost = savePost;
    $scope.save = $translate.instant('app.save');
    $scope.saving = $translate.instant('app.saving');
    $scope.submit = $translate.instant('app.submit');
    $scope.submitting = $translate.instant('app.submitting');
    activate();

    function activate() {

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

        $scope.medias = {};
        $scope.savingText = $translate.instant('app.saving');
        $scope.submittingText = $translate.instant('app.submitting');

        TranslationService.getLanguage().then(language => {
            $scope.activeSurveyLanguage = {language};
        });
    }

    function loadData() {
        let requests = [SurveysSdk.getSurveys($scope.formId), CategoriesSdk.getCategories()];
        return $q.all(requests).then(function (results) {
            $scope.post.form = results[0];
            $scope.post.post_content = results[0].tasks;
            $scope.languages = {default: results[0].enabled_languages.default, active: results[0].enabled_languages.default,  available: [results[0].enabled_languages.default, ...results[0].enabled_languages.available]}

            var categories = results[1];

            // Initialize values on new post
            $scope.post.post_content.map(task => {
                task.fields.map (attr => {
                    // Create associated media entity
                    if (!attr.value) {
                        attr.value = {};
                    }
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
                });
            });
        });
    }

    function canSavePost() {
        return PostEditService.validatePost(
            $scope.post, $scope.postForm, $scope.post.post_content
        );
    }

    function resolveMedia() {
        return MediaEditService.saveMedia($scope.medias, $scope.post);
    }

    function savePost() {
        $scope.saving_post = true;
        if (!$scope.canSavePost()) {
            if ($scope.postForm.$error.required) {
                Notify.error('post.valid.validation_fail');
            } else if ($scope.postForm.$error.step) {
                Notify.error('post.valid.validation_fail_other');
            }
            $scope.saving_post = false;
            return;
        }
        // Create/update any associated media objects
        // Media creation must be completed before we can progress with saving
        resolveMedia().then(function () {
            $scope.post.base_language = $scope.languages.active;
            $scope.post.type = 'report';
            $scope.post.form_id = $scope.post.form.id;
            delete $scope.post.form;
            let post = PostEditService.cleanTagValues(angular.copy($scope.post));
            PostsSdk.savePost(post).then(function (response) {
                post = response.data.result;
                var success_message = (post.status && post.status === 'published') ? 'notify.post.save_success' : 'notify.post.save_success_review';
                if (post.id && post.allowed_privileges.indexOf('read') !== -1) {
                    $scope.saving_post = false;
                    $scope.post.id = post.id;
                    Notify.notify(success_message, { name: $scope.post.title });
                    $state.go('posts.data.detail', {postId: post.id});
                } else {
                    Notify.notify(success_message, { name: post.title });
                    $state.go('posts.map.all');
                }
            }, function (errorResponse) { // errors
                Notify.sdkErrors(errorResponse);
                $scope.saving_post = false;
            });
        });
    }
}
