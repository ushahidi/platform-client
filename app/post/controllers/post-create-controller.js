module.exports = [
    '$scope',
    '$translate',
    '$location',
    '$controller',
    'PostEntity',
    'PostEndpoint',
    'FormEndpoint',
function(
    $scope,
    $translate,
    $location,
    $controller,
    postEntity,
    PostEndpoint,
    FormEndpoint
) {
    var that = this;
    // Initialize the base modify controller and extend it.
    angular.extend(this, $controller('PostModifyController', { $scope: $scope }));

    $translate('post.create_post').then(function(title){
        $scope.title = title;
    });

    $scope.post = postEntity();
    $scope.post_options = PostEndpoint.options();

    FormEndpoint.query().$promise.then(function(forms) {
        $scope.forms = forms;
    });

    $scope.chooseForm = function(form) {
        $scope.active_form = form;
        $scope.post.form = { id: form.id };

        that.fetchAttributes($scope.post.form.id);
    };

    $scope.filterNotDisabled = function (form) {
        return !form.disabled;
    };

    $scope.goBack = function() {
        $scope.active_form = null;
    };

}];
