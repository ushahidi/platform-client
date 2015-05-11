module.exports = [
    '$scope',
    '$translate',
function (
    $scope,
    $translate
) {

    $translate('tool.manage_forms').then(function (title) {
      $scope.title = title;
      $scope.$emit('setPageTitle', title);
  });

}];
