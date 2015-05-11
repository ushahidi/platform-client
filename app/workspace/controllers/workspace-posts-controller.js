module.exports = [
    '$scope',
    '$translate',
function (
    $scope,
    $translate
) {
    $translate('workspace.recent_posts').then(function (title) {
      $scope.title = title;
      $scope.$emit('setPageTitle', title);
  });
}];
