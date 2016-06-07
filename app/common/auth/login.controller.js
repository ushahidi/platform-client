module.exports = [
    'ModalService',
    '$location',
function (
    ModalService,
    $location
) {
    ModalService.openTemplate('<login></login>', 'nav.login', false, false, false, false);
    $location.url('/');
}];
