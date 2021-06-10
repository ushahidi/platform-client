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
    '$rootScope',
    '$scope',
    '_',
    'Flatpickr',
    'SurveysSdk'
];

function PostValueEditController(
    $rootScope,
    $scope,
    _,
    Flatpickr,
    SurveysSdk
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

    $scope.taskIsMarkedCompleted = taskIsMarkedCompleted;

    $scope.isAdmin = $rootScope.isAdmin;
    $scope.duplicatePresent = duplicatePresent;
    $scope.isFieldSetStructure = isFieldSetStructure;
    activate();
    angular.element(document).ready(function () {
        Flatpickr('#date',{});
    });
    $scope.$watch('activeSurveyLanguage', () =>{
        if ($scope.form.title && !$scope.form.title.$dirty) {
            addDefaultValue();
        }
        });

    function activate() {
        addDefaultValue();
    }

    function addDefaultValue() {
        const isTitleOrDesc =  $scope.attribute.type === 'title' || $scope.attribute.type === 'description';
        if (isTitleOrDesc && $scope.attribute.default && !$scope.post.id) {
            let fieldType = $scope.attribute.type === 'description' ? 'content' : $scope.attribute.type;
            $scope.post[fieldType] = $scope.attribute.translations[$scope.activeSurveyLanguage] && $scope.attribute.translations[$scope.activeSurveyLanguage].default ? $scope.attribute.translations[$scope.activeSurveyLanguage].default : $scope.attribute.default;
        }
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
        return !SurveysSdk.areOptionsUnique(attr.options);
    }
}
