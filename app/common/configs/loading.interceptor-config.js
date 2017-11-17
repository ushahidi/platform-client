module.exports = ['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('loading');
    }];
