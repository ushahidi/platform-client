module.exports = ['CacheFactoryProvider', function (CacheFactoryProvider) {
    angular.extend(CacheFactoryProvider.defaults, {
        maxAge: 1 * 60 * 1000, // 15 mins
        cacheFlushInterval: 2 * 60 * 1000, // This cache will clear itself every hour.
        storageMode: 'localStorage',
        storagePrefix: 'ush-caches.',
        deleteOnExpire: 'aggressive'
    });
}];
