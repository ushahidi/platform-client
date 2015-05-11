module.exports = [
    '$scope',
    '$rootScope',
    '$translate',
function (
    $scope,
    $rootScope,
    $translate
) {

    $translate('tool.manage_views').then(function (title) {
      $scope.title = title;
      $rootScope.$emit('setPageTitle', title);
  });

}];
