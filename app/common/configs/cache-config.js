module.exports = ['CacheFactoryProvider', function (CacheFactoryProvider) {
    angular.extend(CacheFactoryProvider.defaults, {
        maxAge: 15 * 60 * 1000, // 15 mins
        cacheFlushInterval: 60 * 60 * 1000, // This cache will clear itself every hour.
        storageMode: 'localStorage',
        storagePrefix: 'ush-caches.',
        deleteOnExpire: 'aggressive'
    });
}];
