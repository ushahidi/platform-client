module.exports = ['$scope', '$translate', function($scope, $translate) {
    $translate('set.add_to_set').then(function(addToSetTranslation){
        $scope.title = addToSetTranslation;
    });

    $scope.isSelected = function() {

        if (angular.element('<li></li>').hasClass('.set-list__item.is-selected')) {
            return true;
        }
        else {
            return false;
        }
    };

}];
