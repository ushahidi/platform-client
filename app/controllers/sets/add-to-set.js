module.exports = function($scope) {
	$scope.title = 'Add Post to Set';

	$scope.isSelected = function() {

		if (angular.element('<li></li>').hasClass('.set-list__item.is-selected')) {
			return true;
		}
		else {
			return false;
		}
	};

};
