module.exports = FilterModal;

FilterModal.$inject = ['ModalService'];
function FilterModal(ModalService) {
    return {
        restrict: 'E',
        controller: FilterModalController,
        template: require('./filter-modal.html')
    };
}

FilterModalController.$inject = ['$scope', 'GisconStatusKey'];
function FilterModalController($scope, GisconStatusKey) {
    $scope.gisconStatusKey = GisconStatusKey;
}

