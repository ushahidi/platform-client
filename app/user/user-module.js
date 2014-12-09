angular.module('users', [])

.service('UserEndpoint', require('./services/endpoints/user-endpoint.js'))
.service('UserEntity', require('./services/entities/user-entity.js'))

.controller('userManager', require('./controllers/user-manager-controller.js'))
.config(require('./user-routes.js'));
