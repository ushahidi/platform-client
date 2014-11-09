module.exports = function(appModule){
    // for the test app, we will mock the backend, so this url is actually never really used
    var backendUrl = 'http://backend';

    appModule
    .constant('BACKEND_URL', backendUrl)
    .constant('API_URL', backendUrl + '/api/v2')
    .constant('OAUTH_CLIENT_ID', 'ushahidiui')
    .constant('OAUTH_CLIENT_SECRET', '35e7f0bca957836d05ca0492211b0ac707671261');
};
