module.exports = [
    '$rootScope',
    'ModalService',
    '_',
function (
    $rootScope,
    ModalService,
    _
) {
    return {
        restrict: 'E',
        template: require('./attribute-editor.html'),
        link: function ($scope, $element, $attrs) {
            $scope.defaultValueToggle = false;
            $scope.descriptionToggle = false;
            $scope.disabledCategories = [];

            $scope.editName = function () {
                if (!$scope.editAttribute.id) {
                    $scope.editAttribute.label = '';
                }
            };
            $scope.closeModal = function () {
                ModalService.close();
            };

            $scope.onlyOptional = function () {
                return $scope.editAttribute.type !== 'title' && $scope.editAttribute.type !== 'description';
            };

            $scope.canDisplay = function () {
                return $scope.editAttribute.input !== 'upload' && $scope.editAttribute.type !== 'title' && $scope.editAttribute.type !== 'description' && $scope.editAttribute.input !== 'tags';
            };

            $scope.changeCategories = function () {
                _.each($scope.availableCategories, function (category) {
                    var selectedChildren = _.chain(category.children)
                        .pluck('id')
                        .intersection($scope.editAttribute.options)
                        .value();

                    // If children are selected, add to disabled categories
                    if (selectedChildren.length > 0) {
                        $scope.disabledCategories[category.id] = true;

                        // ... and ensure this category is selected
                        if (!_.contains($scope.editAttribute.options, category.id)) {
                            $scope.editAttribute.options.push(category.id);
                        }
                    } else {
                        // or, if no children are selected
                        // remove from disabled categories
                        $scope.disabledCategories[category.id] = false;
                    }
                });
            };

            $scope.canMakePrivate = function () {
                return $scope.editAttribute.type !== 'tags';
            };

            $scope.changeCategories();
        }
    };
}];
