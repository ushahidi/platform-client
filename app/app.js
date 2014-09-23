require('angular/angular');
require('angular-route/angular-route');
require('./modules/ui-tabs');
require('angular-ui-bootstrap/src/dropdown/dropdown');
require('angular-ui-bootstrap/src/collapse/collapse');
require('angular-ui-bootstrap/src/transition/transition');
require('angular-ui-bootstrap/src/accordion/accordion');

angular.module('app', ['ngRoute', 'ui.bootstrap.dropdown', 'ui.bootstrap.collapse', 'ui.bootstrap.accordion', 'ui.bootstrap.transition', 'ui.tabs'])
    .directive('postPreview', require('./directives/post-preview.js'))
    .controller('workspaceAccordion', require('./workspace'))
    .controller('navigation', require('./controllers/navigation.js'))

    .config(require('./modules/ui-accordion'))
    .config(require('./routes'));
