module.exports = AddLabelDirective;

AddLabelDirective.$inject = [];

function AddLabelDirective() {
    return {
        restrict: 'E',
        scope: {
            formId: '=',
            attribute: '='
        },
        controller: AddLabelController,
        template: require('./add-category.html')
    };
}
AddLabelController.$inject = ['$scope', 'TagEndpoint', 'FormAttributeEndpoint'];

function AddLabelController($scope, TagEndpoint, FormAttributeEndpoint) {

    $scope.showInput = false;
    $scope.categoryName = '';
    $scope.category = {
        type: 'category',
        icon: 'tag',
        color: '',
        parent_id: null,
        forms: [$scope.formId]
    };

    $scope.showInputToggle = function () {
        $scope.categoryName = '';
        $scope.showInput = !$scope.showInput;
    };

    $scope.saveCategory = function ($event) {
        $event.preventDefault();
        $scope.category.tag = $scope.categoryName;
        $scope.category.slug = $scope.categoryName;
        TagEndpoint.saveCache($scope.category).$promise.then(function (response) {
            if (response.id) {
                // adding new tag to render it in checklist
                $scope.attribute.options.push(response);
                // copying original attribute to be able to extract option.ids
                var attribute = angular.copy($scope.attribute);
                attribute.options = attribute.options.map(function (option) {
                    return option.id;
                });
                //assigning values for saving
                attribute.formId = $scope.formId;
                FormAttributeEndpoint
                    .saveCache(attribute).$promise.then(function (response) {
                        // resetting input-value
                        $scope.categoryName = '';
                    });
            }
        });
    };
}
