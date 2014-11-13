module.exports = [
    '$scope',
    '$translate',
    '$location',
    'PostEntity',
    'PostEndpoint',
    'FormEndpoint',
    'FormAttributeEndpoint',
function(
    $scope,
    $translate,
    $location,
    postEntity,
    PostEndpoint,
    FormEndpoint,
    FormAttributeEndpoint
) {
    $translate('post.create_post').then(function(title){
        $scope.title = title;
    });

    FormEndpoint.query().$promise.then(function(forms) {
        $scope.forms = forms;
    });

    $scope.chooseForm = function(form) {
        $scope.active_form = form;
        $scope.post = postEntity({form_id: form.id});

        FormAttributeEndpoint.query({formId: form.id}).$promise.then(function(attrs) {
            $scope.attributes = attrs;
        });
    };

    $scope.filterNotDisabled = function (form) {
        return !form.disabled;
    };

    $scope.createPost = function(post) {
        $scope.saving_post = true;
        var response = PostEndpoint.save(post, function () {
            if (response.errors){
                // Handle errors
                console.log(response);
            }

            if (response.id) {
                $location.path('/post/' + response.id);
            }
        });
    };

    $scope.isDate = function(attr) {
        return attr.input === 'date';
    };
    $scope.isLocation = function(attr) {
        return attr.input === 'location';
    };
    $scope.isSelect = function(attr) {
        return attr.input === 'select';
    };
    $scope.isText = function(attr) {
        return attr.input === 'text';
    };
    $scope.isTextarea = function(attr) {
        return attr.input === 'textarea';
    };
}];
