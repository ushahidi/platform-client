module.exports = LoginController;

LoginController.$inject = ['Authentication','$location'];
function LoginController(Authentication, $location) {
    Authentication.openLogin();
    $location.url('/');
}
