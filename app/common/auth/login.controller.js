module.exports = LoginController;

LoginController.$inject = ['Authentication','$location', 'Features'];
function LoginController(Authentication, $location, Features) {
    Authentication.openLogin();
    var path = Features.isFeatureEnabled('private') ? '/private' : '/';
    $location.url(path);
}
