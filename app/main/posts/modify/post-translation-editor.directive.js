module.exports = PostTranslationEditor;

PostTranslationEditor.$inject = [];

function PostTranslationEditor() {
    return {
        restrict: 'E',
        controller: PostTranslationEditorController,
        scope: {
            post: '=',
            activeLanguage:'=',
            defaultLanguage:'=',
            form: '='
        },
        template: require('./post-translation-editor.html')
    };
}
PostTranslationEditorController.$inject = ['$scope', '_'];

function PostTranslationEditorController($scope, _) {

    $scope.canTranslate = canTranslate;
    $scope.$watch('activeLanguage', () =>{
        if ($scope.activeLanguage && $scope.activeLanguage !== $scope.defaultLanguage) {
            addPrefillValue();
        }
        });

    function activate() {}
    activate();

    function addPrefillValue() {
        _.each($scope.post.post_content, task => {
            _.each(task.fields, field => {
                if (field.type === 'title' || field.type === 'description') {
                    let fieldType = field.type === 'description' ? 'content' : 'title';
                    if (!$scope.post.translations[$scope.activeLanguage]) {
                        $scope.post.translations[$scope.activeLanguage] = {};
                    }
                    // Checking if there already is a translated value
                    let value = $scope.post.translations[$scope.activeLanguage][fieldType] ? $scope.post.translations[$scope.activeLanguage][fieldType] : null;
                    // Checking if there is a default value
                    let defaultValue = field.translations[$scope.activeLanguage] && field.translations[$scope.activeLanguage].default ? field.translations[$scope.activeLanguage].default : null;
                    // Assigning default-value if no other value is present
                    if (!value && defaultValue) {
                        $scope.post.translations[$scope.activeLanguage][fieldType] = defaultValue;
                    }
                }
            });
        });
    }

    function canTranslate(field) {
        return field.type === 'text' || field.type === 'markdown' ||
            (field.input === 'text' && field.type !== 'title' && field.type !== 'description');
    }

}
