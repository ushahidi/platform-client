module.exports = [
    '$scope',
    '$translate',
function(
    $scope,
    $translate
) {

  $translate('tool.manage_appearance').then(function(title){
      $scope.title = title;
      $scope.$emit('setPageTitle', title);
  });

}];
