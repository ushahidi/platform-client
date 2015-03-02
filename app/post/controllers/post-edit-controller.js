module.exports = [
    '$scope',
    '$translate',
    '$location',
    '$routeParams',
    '$controller',
    'PostEndpoint',
    'FormEndpoint',
function(
    $scope,
    $translate,
    $location,
    $routeParams,
    $controller,
    PostEndpoint,
    FormEndpoint
) {
    var that = this;
    // Initialize the base modify controller and extend it.
    angular.extend(this, $controller('PostModifyController', { $scope: $scope }));

    $translate('post.edit_post').then(function(title){
        $scope.title = title;
    });

    // Activate editing mode
    $scope.is_edit = true;

    PostEndpoint.get({id: $routeParams.id}).$promise.then(function(post) {
        var tags = [];
        post.tags.map(function (tag) {
            tags.push(parseInt(tag.id));
        });
        post.tags = tags;

        $scope.post = post;
        $scope.active_form = FormEndpoint.get({formId: post.form.id});

        that.fetchAttributes($scope.post.form.id);
    });

    $scope.goBack = function() {
        $location.path('/posts/' + $scope.post.id);
    };

}];
