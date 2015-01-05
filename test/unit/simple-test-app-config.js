var rootPath = '../../';

module.exports = function(appModule){
    // for the test app, we will mock the backend, so this url is actually never really used
    var backendUrl = 'http://backend';

    appModule
        .factory('_', function() {
            return window._;
        })
        .constant('CONST', {
            'BACKEND_URL'         : backendUrl,
            'API_URL'             : backendUrl + '/api/v2',
            'OAUTH_CLIENT_ID'     : 'ushahidiui',
            'OAUTH_CLIENT_SECRET' : '35e7f0bca957836d05ca0492211b0ac707671261'
        })
        .service('Util', require(rootPath + 'app/services/util.js'));
};
