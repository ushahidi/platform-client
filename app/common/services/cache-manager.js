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

        removeRegexKey: function (cacheId, cacheKeyRegex) {
            var cache = CacheFactory.get(cacheId);    
            var keys = _.filter(cache.keys(), function (key) {
                return key.match(cacheKeyRegex);
            });
            _.each(keys, function (value, key) {
                cache.remove(value);
            }); 
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

