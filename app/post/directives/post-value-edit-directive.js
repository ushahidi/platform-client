module.exports = [
    '_',
function (
    _
) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            form: '=',
            post: '=',
            attribute: '='
        },
        templateUrl: 'templates/posts/post-value-edit.html',
        controller: [
            '$scope',
        function ($scope) {
            $scope.isDate = function (attr) {
                return attr.input === 'date';
            };
            $scope.isDateTime = function (attr) {
                return attr.input === 'datetime';
            };
            $scope.isLocation = function (attr) {
                return attr.input === 'location';
            };
            $scope.isSelect = function (attr) {
                return attr.input === 'select';
            };
            $scope.isNumber = function (attr) {
                return attr.input === 'number';
            };
            $scope.isText = function (attr) {
                return attr.input === 'text';
            };
            $scope.isTextarea = function (attr) {
                return attr.input === 'textarea';
            };
            $scope.isCheckbox = function (attr) {
                return attr.input === 'checkbox';
            };
            $scope.isRadio = function (attr) {
                return attr.input === 'radio';
            };
            $scope.isRelation = function (attr) {
                return attr.input === 'relation';
            };
            $scope.isUpload = function (attr) {
                return attr.input === 'upload';
            };
            // Can more values be added for this attribute?
            $scope.canAddValue = function (attr) {
                return (
                    // Attribute allows unlimited values
                    attr.cardinality === 0 ||
                    // Less values than cardinality allows
                    $scope.post.values[attr.key].length < attr.cardinality
                );
            };
            // Can this values be removed?
            $scope.canRemoveValue = function (attr, key) {
                return $scope.post.values[attr.key].length > 1;
            };
            // Add a new value
            $scope.addValue = function (attr) {
                $scope.post.values[attr.key].push(null);
            };
            // Remove a value
            $scope.removeValue = function (attr, key) {
                $scope.post.values[attr.key].splice(key, 1);
            };
        }]
    };
}];
