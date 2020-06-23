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
                    if (attr.input === 'upload') {
                        $scope.medias[attr.id] = {};
                    }
                    if (attr.input === 'tags') {
                        // adding category-objects attribute-options
                        attr.options = PostActionsService.filterPostEditorCategories(attr.options, categories);
                        // tag.id needs to be a number
                        if (attr.value) {
                            attr.value = attr.value.map(function (id) {
                                return parseInt(id);
                            });
                        } else {
                            attr.value = [];
                        }
                    }
                    if (attr.input === 'number') {
                        if (attr.value) {
                            attr.value = parseFloat(attr.value);
                        } else if (attr.default) {
                            attr.value = parseInt(attr.default);
                        }
                    }
                    if (attr.input === 'date' || attr.input === 'datetime') {
                        // Date picker requires date object
                        // ensure that dates are preserved in UTC
                        if (attr.value) {
                            attr.value = moment(attr.value).toDate();
                        } else {
                            attr.value = attr.default ? new Date(attr.default) : new Date();
                        }
                    }
                });
            });
        });
    }

    function canSavePost() {
        return PostEditService.validatePost($scope.post, $scope.postForm, $scope.tasks);
    }

    function resolveMedia() {
        return MediaEditService.saveMedia($scope.medias, $scope.post);
    }

    function savePost() {
        $scope.saving_post = true;
        if (!$scope.canSavePost()) {
            Notify.error('post.valid.validation_fail');
            $scope.saving_post = false;
            return;
        }
        // Create/update any associated media objects
        // Media creation must be completed before we can progress with saving
        resolveMedia().then(function () {
            // Clean up post values object
            var post = PostEditService.cleanPostValues(angular.copy($scope.post));
            post.base_language = $scope.languages.active;
            post.type = 'report';
            post.form_id = post.form.id;
            delete post.form;
            PostsSdk.savePost(post).then(function (response) {
                var success_message = (response.status && response.status === 'published') ? 'notify.post.save_success' : 'notify.post.save_success_review';
                if (response.id && response.allowed_privileges.indexOf('read') !== -1) {
                    $scope.saving_post = false;
                    $scope.post.id = response.id;
                    Notify.notify(success_message, { name: $scope.post.title });
                    $state.go('posts.data.detail', {postId: response.id});
                } else {
                    Notify.notify(success_message, { name: $scope.post.title });
                    $state.go('posts.map.all');
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
