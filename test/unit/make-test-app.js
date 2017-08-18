module.exports = function () {
    let appModule = angular.module('testApp', ['ushahidi.mock']);
    // for the test app, we will mock the backend, so this url is actually never really used
    var backendUrl = 'http://backend',
    claimedAnonymousScopes = [
        'posts',
        'media',
        'forms',
        'api',
        'tags',
        'sets',
        'users',
        'stats',
        'layers',
        'config',
        'messages'
    ];

    appModule
        .factory('_', function ($window) {
            return require('underscore/underscore');
        })
        .constant('CONST', {
            'BACKEND_URL'         : backendUrl,
            'API_URL'             : backendUrl + '/api/v2',
            'OAUTH_CLIENT_ID'     : 'ushahidiui',
            'OAUTH_CLIENT_SECRET' : '35e7f0bca957836d05ca0492211b0ac707671261',
            'CLAIMED_ANONYMOUS_SCOPES' : claimedAnonymousScopes,
            'CLAIMED_USER_SCOPES' : claimedAnonymousScopes.concat('dataproviders')
        })
        .service('Util', require('app/common/services/util.js'));

    return appModule;
};
