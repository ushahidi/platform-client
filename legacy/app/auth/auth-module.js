angular.module('ushahidi.auth', [])

// Authentication
.service('Authentication', require('./authentication.service.js'))
.service('Registration', require('./registration.service.js'))
.service('Session', require('./session.service.js'))
.service('PasswordReset', require('./password-reset.service.js'))
.service('TermsOfService', require('./tos.service.js'))
.service(
    'DemoDeploymentService',
    require('./demo-deployment.service.js')
)
.directive('login', require('./login.directive.js'))
.directive('register', require('./register.directive.js'))
.directive('passwordReset', require('./password-reset.directive.js'))
.directive(
    'passwordResetConfirm',
    require('./password-reset-confirm.directive.js')
)
.directive('termsOfService', require('./tos.directive.js'))
.directive('demoDeployment', require('./demo-deployment.directive.js'))

// From common module
.service('TermsOfServiceEndpoint', require('./services/terms-of-service-endpoint.js'))

.config(require('./authentication-interceptor.config.js'))
.run(require('./authentication-events.run.js'))

.config(require('./auth-routes.js'))
