angular.module('gravatarHelper', [])
.factory('gravatar', function() {
    return require('gravatar');
})
.run(['$rootScope', 'gravatar', function($rootScope, gravatar){
    $rootScope.getGravatar = function(email) {
        return gravatar.url(email, {default: 'retro'});
    };
}]);
