module.exports = function($provide) {
	$provide
		.decorator('accordionDirective', function($delegate) {
			$delegate[0].templateUrl = 'templates/accordion/accordion.html';
			return $delegate;
		});
	$provide.decorator('accordionGroupDirective', function($delegate) {
 			$delegate[0].templateUrl = 'templates/accordion/accordion-group.html';
			return $delegate;
		});
};
