require('angular/angular');
require('angular-route/angular-route');
require('./modules/ui-tabs');
require('angular-ui-bootstrap/src/dropdown/dropdown');

require('./partials');

var app = angular.module('app', ['ngRoute', 'ui.bootstrap.dropdown', 'ui.tabs', 'partials'])
    .config(require('./routes'));

require('./controllers/navigation.js')(app);