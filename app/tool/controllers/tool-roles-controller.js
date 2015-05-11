module.exports = [
    '$scope',
    '$translate',
function (
    $scope,
    $translate
) {

    $translate('tool.manage_roles').then(function (title) {
      $scope.title = title;
      $scope.$emit('setPageTitle', title);
  });

}];
