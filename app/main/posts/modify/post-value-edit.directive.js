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
            categories: '=',
            activeSurveyLanguage:'='
        },
        controller: PostValueEditController,
        template: require('./post-value-edit.html')
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

    $scope.taskIsMarkedCompleted = taskIsMarkedCompleted;

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
}
