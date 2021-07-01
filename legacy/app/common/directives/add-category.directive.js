module.exports = AddCategoryDirective;

AddCategoryDirective.$inject = [];

function AddCategoryDirective() {
    return {
        restrict: 'E',
        scope: {
            survey: '=',
            attribute: '=',
            activeLanguage: '=',
            available: '='
        },
        controller: AddCategoryController,
        template: require('./add-category.html')
    };
}
AddCategoryController.$inject = ['$rootScope','$scope', 'CategoriesSdk', 'SurveysSdk', 'Notify', '_'];

function AddCategoryController($rootScope, $scope, CategoriesSdk, SurveysSdk, Notify, _) {
    $scope.showInput = false;
    $scope.categoryName = '';
    $scope.category = {
        type: 'category',
        icon: 'tag',
        color: '',
        parent_id: null,
        base_language: $scope.activeLanguage
    };

    activate();

    function activate() {
        $scope.userCanAddCategory = $rootScope.hasPermission('Manage Settings');
    }

    $scope.showInputToggle = function () {
        $scope.categoryName = '';
        $scope.showInput = !$scope.showInput;
    };


    $scope.saveCategory = function ($event) {
        $event.preventDefault();
        $scope.category.tag = $scope.categoryName;
        $scope.category.slug = $scope.categoryName;
        CategoriesSdk.saveCategory($scope.category).then(function (response) {
            let category = response.data.result;
            $scope.fieldToEdit;
            if (category.id) {
                // adding new tag to render it in checklist
                _.each($scope.survey.tasks, task=>{
                    _.each(task.fields, field => {
                        if (field.id === $scope.attribute.id) {
                            $scope.fieldToEdit = field;
                        }
                    });
                });
                $scope.fieldToEdit.options.push(category);
                //assigning values for saving
                SurveysSdk.saveSurvey($scope.survey)
                    .then(function (response) {
                        // resetting input-value
                        $scope.categoryName = '';
                    });
                $scope.available.push(category);
                $scope.$apply();
                Notify.notify('category added', {response: category});
            }
        }, function (errorResponse) {
            Notify.apiErrors(errorResponse);
        });
    };
}
