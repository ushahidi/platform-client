module.exports = [
    '$scope',
    '$rootScope',
    '$translate',
    '$location',
    'RoleEndpoint',
    'CategoriesSdk',
    'Notify',
    '_',
    '$transition$',
    '$q',
    '$state',
    'TranslationService',
    'UtilsSdk',
    'LoadingProgress',
function (
    $scope,
    $rootScope,
    $translate,
    $location,
    RoleEndpoint,
    CategoriesSdk,
    Notify,
    _,
    $transition$,
    $q,
    $state,
    TranslationService,
    UtilsSdk,
    LoadingProgress
) {

    // Redirect to home if not authorized
    if ($rootScope.hasManageSettingsPermission() === false) {
        return $location.path('/');
    }

    // Set initial category properties and page title
    if ($location.path() === '/settings/categories/create') {
        // Allow parent category selector
        $scope.isParent = false;
        // Translate and set add category page title
        $translate('category.add_tag').then(function (title) {
            $scope.title = title;
            $scope.$emit('setPageTitle', title);
        });
            $scope.category = {
                base_language: 'en',
                type: 'category',
                icon: 'tag',
                color: '',
                parent_id: null,
                parent_id_original: null,
                translations: {}
            };
            TranslationService.getLanguage().then(language => {
                //active language is the same as default when starting out.
                if (!$scope.category.enabled_languages) {
                    $scope.category.enabled_languages = {
                        default: language,
                        available: []
                    }
                }
                $scope.languages = {
                    defaultLanguage: language,
                    activeLanguage: language
                };

                $scope.selectedLanguage = language;
                });
    } else {
        // Translate and set edit category page title
        $translate('category.edit_tag').then(function (title) {
            $scope.title = title;
            $rootScope.$emit('setPageTitle', title);
        });
    }

    // Change mode
    $scope.$emit('event:mode:change', 'settings');

    $scope.deleteCategory = deleteCategory;
    $scope.getParentName = getParentName;
    $scope.saveCategory = saveCategory;

    $scope.cancel = cancel;

    $scope.processing = false;
    $scope.save = $translate.instant('app.save');
    $scope.saving = $translate.instant('app.saving');
    $scope.isLoading = LoadingProgress.getLoadingState;


    activate();

    function activate() {
        getLanguages();
        getRoles();
        getCategories();
    }

    function getLanguages() {
        UtilsSdk.getLanguages().then(languages => {
            $scope.languagesToSelect = languages.results;
        });
    }
    function getRoles() {
        RoleEndpoint.query().$promise.then(function (roles) {
            $scope.roles = roles;
        });
    }

    function getCategories() {
        CategoriesSdk.getCategories().then(function (categories) {
            // setting parents for dropdown
            $scope.parents = _.map(_.where(categories, { parent_id: null }));
            // setting category-object we are working on, existing or new
            if ($transition$.params().id) {
                $scope.category = _.filter(categories, {id: parseInt($transition$.params().id)})[0];
                $scope.languages = {
                    defaultLanguage: $scope.category.enabled_languages.default,
                    activeLanguage: $scope.category.enabled_languages.default
                };

                $scope.selectedLanguage = $scope.category.enabled_languages.default;
                $scope.category.translations = Object.assign({}, $scope.category.translations);
            }
            //Normalize parent category
            if ($scope.category.parent) {
                $scope.category.parent_id = $scope.category.parent.id;
                $scope.category.parent_id_original = $scope.category.parent.id;
            }

            if ($scope.category.children && $scope.category.children.length) {
                $scope.isParent = true;
            }
            $scope.$apply();
        });
    }

    function getParentName() {
        var parentName = 'Nothing';
        if ($scope.category && $scope.parents.length > 0) {
            parentName = $scope.category.parent.tag;
        }
        return parentName;
    }

    function saveCategory() {
        // Set processing to disable user actions
        $scope.processing = true;

        //Ensure slug is updated to tag
        $scope.category.slug = $scope.category.tag;
        $scope.category.base_language = $scope.category.enabled_languages.default;
        // If child category with new parent
        if ($scope.category.parent_id && $scope.category.parent_id !== $scope.category.parent_id_original) {
            let parent = _.findWhere($scope.parents, { id: $scope.category.parent_id });
            // apply new permissions to child category
            $scope.category.role = parent.role;
        }
        // Save category
        CategoriesSdk.saveCategory($scope.category)
        .then(function (result) {
            // If parent category, apply parent category permisions to child categories
            if (result.children && result.children.length) {
                return updateChildrenPermissions(result);
            }
            // Display success message
            Notify.notify(
                'notify.category.save_success',
                { name: $scope.category.tag }
            );
             // Redirect to categories list
            $state.go('settings.categories', {}, { reload: true });
        }, function(err) {
        // Catch and handle errors
            handleResponseErrors(err);
        });
    }

    function updateChildrenPermissions(category) {
        var promises = [];
        _.each(category.children, function (child) {
            child.role = category.role;
            promises.push(
              CategoriesSdk.saveCategory(child));
        });
        return $q.all(promises);
    }

    function deleteCategory(category) {
        Notify.confirmDelete(
            'notify.category.destroy_confirm',
            'notify.category.destroy_confirm_desc'
        ).then(function () {
            return CategoriesSdk
            .deleteCategory(category.id)
            .then(function () {
                Notify.notify('notify.category.destroy_success');
                $state.go('settings.categories', {}, { reload: true });
            });
        })
        .catch(handleResponseErrors);
    }

    function handleResponseErrors(errorResponse) {
        $scope.processing = false;
        Notify.apiErrors(errorResponse);
    }

    function cancel() {
        $state.go('settings.categories', {}, { reload: true });
    }

    $scope.selectLanguage = function  (language) {
        if ($scope.category.enabled_languages.available.indexOf(language) > -1) {
            $scope.showLangError = true;
        } else {
            $scope.showLangError = false;

            $scope.languages  = {
                defaultLanguage: language,
                activeLanguage: $scope.defaultLanguage
            };

            $scope.selectedLanguage = $scope.defaultLanguage;
            $scope.category.enabled_languages.default = language;
        }
    }

    $scope.removeLanguage = function(index, language) {
        Notify.confirmModal('Are you sure you want to remove this language and all the translations?','','','','Remove language', 'cancel')
        .then(function() {
            $scope.category.enabled_languages.available.splice(index,1);
            delete $scope.category.translations[language];
            $scope.languages.activeLanguage = $scope.languages.defaultLanguage;
        });
    };
}];
