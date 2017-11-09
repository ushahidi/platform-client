module.exports = PostDataEditor;

PostDataEditor.$inject = [];

function PostDataEditor() {
    return {
        restrict: 'E',
        scope: {
            postContainer: '=',
            attributesToIgnore: '=',
            postMode: '=',
            editMode: '=',
            isLoading: '=',
            savingPost: '=',
            parentForm: '='
        },
        template: require('./post-data-editor.html'),
        controller: require('./post-data-editor.controller.js')
    };
}
