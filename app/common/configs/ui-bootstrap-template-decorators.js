module.exports = [
    '$provide',
function (
    $provide
) {
    $provide.decorator('uibPaginationDirective', ['$delegate', function ($delegate) {
        //we now get an array of all the pagination directives,
        //and use the first one
        $delegate[0].templateUrl = 'templates/angular-ui-bootstrap/pagination/pagination.html';
        return $delegate;
    }]);
}];
