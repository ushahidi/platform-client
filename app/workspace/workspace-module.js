angular.module('workspace', [])
    .directive('workspaceMenu', require('./directives/workspace-menu-directive.js'))
    .config(require('./workspace-routes.js'));
