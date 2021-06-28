module.exports = [
    'PasswordReset',
    '$location',
function (
    PasswordReset,
    $location
) {
    PasswordReset.openReset();
    $location.url('/');
}];
