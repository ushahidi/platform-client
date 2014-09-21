require('angular/angular');
require('angular-route/angular-route');
require('./modules/ui-tabs');
require('angular-ui-bootstrap/src/dropdown/dropdown');

angular.module('app', ['ngRoute', 'ui.bootstrap.dropdown', 'ui.tabs'])
    .directive('postPreview', require('./directives/post-preview.js'))
    .controller('navigation', require('./controllers/navigation.js'))
    .config(require('./routes'));
