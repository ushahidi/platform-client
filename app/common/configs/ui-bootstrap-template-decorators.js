module.exports = [
    '$provide',
function (
    $provide
) {
    $provide.decorator('paginationDirective', ['$delegate', function ($delegate) {
        //we now get an array of all the pagination directives,
        //and use the first one
        $delegate[0].templateUrl = 'templates/angular-ui-bootstrap/pagination/pagination.html';
        return $delegate;
    }]);
    $provide.decorator('datepickerDirective', ['$delegate', function ($delegate) {
        $delegate[0].templateUrl = 'templates/angular-ui-bootstrap/datepicker/datepicker.html';
        return $delegate;
    }]);
    $provide.decorator('daypickerDirective', ['$delegate', function ($delegate) {
        $delegate[0].templateUrl = 'templates/angular-ui-bootstrap/datepicker/day.html';
        return $delegate;
    }]);
    $provide.decorator('monthpickerDirective', ['$delegate', function ($delegate) {
        $delegate[0].templateUrl = 'templates/angular-ui-bootstrap/datepicker/month.html';
        return $delegate;
    }]);
    $provide.decorator('yearpickerDirective', ['$delegate', function ($delegate) {
        $delegate[0].templateUrl = 'templates/angular-ui-bootstrap/datepicker/year.html';
        return $delegate;
    }]);
    $provide.decorator('datepickerPopupWrapDirective', ['$delegate', function ($delegate) {
        $delegate[0].templateUrl = 'templates/angular-ui-bootstrap/datepicker/popup.html';
        return $delegate;
    }]);
    $provide.decorator('timepickerDirective', ['$delegate', function ($delegate) {
        $delegate[0].templateUrl = 'templates/angular-ui-bootstrap/timepicker/timepicker.html';
        return $delegate;
    }]);
}];
