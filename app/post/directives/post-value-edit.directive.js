module.exports = PostValueEdit;

PostValueEdit.$inject = [];

function PostValueEdit() {
    return {
        restrict: 'E',
        scope: {
            form: '=',
            post: '=',
            attribute: '='
        },
        controller: PostValueEditController,
        templateUrl: 'templates/posts/modify/post-value-edit.html'
    };
}

PostValueEditController.$inject = [
    '$scope',
    '_'
];

function PostValueEditController(
    $scope,
    _
) {
    $scope.isDate = isDate;
    $scope.isDateTime = isDateTime;
    $scope.isText = isText;
    $scope.isTextarea = isTextarea;
    $scope.isCheckbox = isCheckbox;

    $scope.dateFormat = { format: 'yyyy-mm-dd' };

    $scope.canAddValue = canAddValue;
    $scope.canRemoveValue = canRemoveValue;
    $scope.addValue = addValue;
    $scope.removeValue = removeValue;

    activate();

    function activate() {

    }

    function isDate(attr) {
        return attr.input === 'date';
    }
    function isDateTime(attr) {
        return attr.input === 'datetime';
    }
    function isText(attr) {
        return attr.input === 'text';
    }
    function isTextarea(attr) {
        return attr.input === 'textarea';
    }
    function isCheckbox(attr) {
        return attr.input === 'checkbox';
    }

    // Can more values be added for this attribute?
    function canAddValue(attr) {
        return (
            // Attribute allows unlimited values
            attr.cardinality === 0 ||
            // Less values than cardinality allows
            $scope.post.values[attr.key].length < attr.cardinality
        );
    }
    // Can this values be removed?
    function canRemoveValue(attr, key) {
        return $scope.post.values[attr.key].length > 1;
    }
    // Add a new value
    function addValue(attr) {
        $scope.post.values[attr.key].push(null);
    }
    // Remove a value
    function removeValue(attr, key) {
        $scope.post.values[attr.key].splice(key, 1);
    }
}
