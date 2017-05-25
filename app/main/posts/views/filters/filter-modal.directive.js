module.exports = FilterModal;

FilterModal.$inject = ['ModalService'];
function FilterModal(ModalService) {
    return {
        restrict: 'E',
        link: FilterModalLink,
        template: require('./filter-modal.html')
    };
}


function FilterModalLink($scope, $element, $attrs) {
}

