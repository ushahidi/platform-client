class Endpoint {
    constructor(id, url, params, methods, $resource, CacheFactory, $q) {
        this.initCache(CacheFactory, id);
        this.initResource($resource, url, params, methods);
        this.$q = $q;
    }

    initCache(CacheFactory, id) {
        if (!(this.cache = CacheFactory.get(id))) {
            this.cache = new CacheFactory(id);
        }
        return this.cache;
    }

    initResource($resource, url, params, methods) {
        let defaultParams = {
            id: '@id'
        };
        let defaultMethods = {
            query: {
                method: 'GET',
                isArray: true,
                params: {
                    order: 'asc',
                    orderby: 'priority'
                },
                transformResponse: function (data) {
                    return angular.fromJson(data).results;
                }
            },
            save: {
                method: 'POST'
            },
            update: {
                method: 'PUT'
            },
            get: {
                method: 'GET'
            },
            delete: {
                method: 'DELETE'
            }
        };

        params = angular.extend(defaultParams, params);
        methods = angular.extend(defaultMethods, methods);

        this.resource = $resource(url, params, methods);
    }

    /**
     * [query description]
     * @return {[type]} [description]
     */
    query(params, cb, options) {
        let cacheId = JSON.stringify(params);
        let result;
        if (!(result = this.cache.get(cacheId)) || options.fresh) {
            result = this.resource.query(params);

            result.$promise.then((result) => {
                this.cache.put(cacheId, result);
            }, () => {});
        }

        return result;
    }
    // Legacy
    queryFresh(params, cb) {
        return this.query(params, cb, { fresh : true });
    }

    get(params, cb, options) {
        // @todo make keys shorter?? specify ids?
        let cacheId = JSON.stringify(params);
        let result;

        options = options || {};
        if (!(result = this.cache.get(cacheId)) || options.fresh) {
            result = this.resource.get(params);

            result.$promise.then((result) => {
                this.cache.put(cacheId, result);
                this.requestCache.remove();
            }).catch(angular.noop);
        } else {
            // Add $promise to our response, even when it comes from the cache
            result.$promise = this.$q.when(result);
        }

        // Run the callback
        result.$promise.then(cb).catch(angular.noop);

        return result;
    }
    // Legacy
    getFresh(params, cb) {
        return this.get(params, cb, { fresh : true });
    }

    save(data, cb) {
        let request = this.resource.save(data);

        request.$promise.then((result) => {
            // @todo make keys shorter?? specify ids?
            let cacheId = JSON.stringify({id: result.id});
            this.cache.put(cacheId, result);
        }, () => {});

        return request;
    }
    // Legacy alias
    saveCache(data, cb) {
        return this.save(data, cb);
    }

    update(params, data, cb) {
        let request = this.resource.update(params, data);
        // @todo make keys shorter?? specify ids?
        let cacheId = JSON.stringify(params);

        request.$promise.then((result) => {
            this.cache.put(cacheId, result);
        }, () => {});

        return request;
    }

    delete(params, cb) {
        let request = this.resource.delete(params);
        // @todo make keys shorter?? specify ids?
        let cacheId = JSON.stringify(params);

        request.$promise.then((result) => {
            this.cache.remove(cacheId);
        }, () => {});

        return request;
    }

    invalidateCache() {
        this.cache.clearAll();
    }
}

function resolvePromiseWithResult(result) {
    resolvePromise(result.data, result.status, shallowCopy(result.headers()), result.statusText);
}

function isPromiseLike(obj) {
  return obj && angular.isFunction(obj.then);
}

export default Endpoint
