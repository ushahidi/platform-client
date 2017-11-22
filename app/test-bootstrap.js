require('./app');
require('./mock-backend-config.js');
window.ushahidi.bootstrapConfig = require('../mocked_backend/api/v3/config.json').results;
// Just bootstrap the app immediately
angular.bootstrap(document, ['app'], {
    strictDi: true
});
