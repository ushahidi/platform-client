require('./app');
require('angular-lazy-bootstrap/src/bootstrap.js');

// Load site config THEN bootstrap the app
angular.lazy()
    .resolve(['$q', '$http', function ($q, $http) {
        return $http.get(window.ushahidi.apiUrl + '/config')
        .then(function (response) {
            window.ushahidi.bootstrapConfig = response.data.results;
        });
    }])
    .loading(function () {
        // Show loading
        angular.element(document.getElementById('bootstrap-loading')).removeClass('hidden');
    })
    .error(function (error) {
        // Show error
        try {
            error.data.errors[0].message &&
            angular.element(document.getElementById('bootstrap-error-message')).html(error.data.errors[0].message);
        } finally {
            angular.element(document.getElementById('bootstrap-error')).removeClass('hidden');
        }
    })
    .done(function () {
        // Hide loading
        angular.element(document.getElementById('bootstrap-loading')).addClass('hidden');
    })
    .bootstrap(document, ['app'], {
        strictDi: true
    });
