module.exports = ModalBody;

ModalBody.$inject = ['$window'];
function ModalBody($window) {
    return {
        restrict: 'AC',
        link: ModalBodyLink
    };

    function ModalBodyLink($scope, $element) {
        activate();

        function activate() {
            $element.css('max-height', modalBodyHeight());
        }

        angular.element($window).bind('resize', handleResize);
        // Unbind on destroy
        $scope.$on('$destroy', function (event) {
            angular.element($window).unbind('resize', handleResize);
        });

        function modalBodyHeight() {
            return $window.innerHeight * 0.66 + 'px';
        }

        function handleResize() {
            activate();

            // Manual $digest required as resize event
            // is outside of angular
            $scope.$digest();
        }
    }
}
