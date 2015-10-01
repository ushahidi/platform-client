module.exports = [
    'CacheFactory',
    'Util',
    '_',
function (
    CacheFactory,
    Util,
    _
) {

    var CacheManager = {

        invalidateCache: function (cacheId) {
            CacheFactory.destroy(cacheId);    
        },

        updateCacheItem: function (cacheId, item) {
            var cache = CacheFactory.get(cacheId);    
            cache.put(item.url, item); 
        },
        
        removeCacheItem: function (cacheId, item) {
            var cache = CacheFactory.get(cacheId);    
            cache.remove(item.url);
        },

        removeCacheGroup: function (cacheId, id) {
            var cache = CacheFactory.get(cacheId);    
            cache.remove(Util.apiUrl(id));
        },

    };

    return Util.bindAllFunctionsToSelf(CacheManager);
}];

