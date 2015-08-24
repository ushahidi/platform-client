module.exports = [
    'CollectionEndpoint',
    '_',
function (
    CollectionEndpoint,
    _
) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            ngModel: '='
        },
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            scope.collections = CollectionEndpoint.editableByMe();
            scope.selectedCollectionId = '';

            scope.$watch(function () {
                return scope.selectedCollectionId;
            }, function (id) {
                if (id) {
                    var collection = _.findWhere(scope.collections, { id : parseInt(id) });
                    ngModel.$setViewValue({ id: collection.id,  name: collection.name });
                }

                // Revert back to drop down title
                scope.selectedCollectionId = '';
            });
        },
        templateUrl: 'templates/views/select-collection.html'
    };
}];
