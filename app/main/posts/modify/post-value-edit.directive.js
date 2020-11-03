module.exports = PostValueEdit;

PostValueEdit.$inject = [];

function PostValueEdit() {
    return {
        restrict: 'E',
        scope: {
            form: '=',
            post: '=',
            attribute: '=',
            postField: '=',
            medias: '=',
            categories: '='
        },
        controller: PostValueEditController,
        template: require('./post-value-edit.html')
    };
}

PostValueEditController.$inject = [
    '$rootScope',
    '$scope',
    '_'
];

function PostValueEditController(
    $rootScope,
    $scope,
    _
) {
    var fieldSetAttributes = [
        'checkbox',
        'radio',
        'tags'
    ];
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
    $scope.taskIsMarkedCompleted = taskIsMarkedCompleted;

    $scope.isAdmin = $rootScope.isAdmin;
    $scope.duplicatePresent = duplicatePresent;

    $scope.isFieldSetStructure = isFieldSetStructure;
    activate();

    function activate() {
    }

    function taskIsMarkedCompleted() {
        // If we are dealing with a Post Field we want to always show errors for required post fields
        // Otherwise we only want to show errors for required fields of Tasks marked as completed
        return !_.isUndefined($scope.postField) ? true : _.contains($scope.post.completed_stages, $scope.attribute.form_stage_id);
    }

    function isFieldSetStructure(attr) {
        if (_.contains(fieldSetAttributes, attr.input)) {
            return true;
        }
        return false;
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
    // Is duplicate present in options attribute?
    function duplicatePresent(attr) {
        if (attr.options.length < 1) {
            return false;
        }
        let tmp = [];
        for (let x of attr.options) {
            if (tmp.indexOf(x) !== -1) {
                return true;
            }
            tmp.push(x);
        }
        return false;
    }
}
