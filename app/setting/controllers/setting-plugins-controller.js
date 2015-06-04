module.exports = [
    '$scope',
    '$rootScope',
    '$translate',
function (
    $scope,
    $rootScope,
    $translate
) {

    $translate('tool.manage_plugins').then(function (title) {
      $scope.title = title;
      $rootScope.$emit('setPageTitle', title);
  });

}];
