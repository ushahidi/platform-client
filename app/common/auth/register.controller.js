module.exports = RegisterController;

RegisterController.$inject = ['Registration','$location'];
function RegisterController(Registration, $location) {
    Registration.openRegister();
    $location.url('/');
}
