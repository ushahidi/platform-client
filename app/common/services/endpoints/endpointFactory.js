EndpointFactoryFactory.$inject = ['$resource', 'CacheFactory', '$q', 'Util', 'Endpoint'];
function EndpointFactoryFactory($resource, CacheFactory, $q, Util, Endpoint) {
	return function EndpointFactory(id, url, params, methods) {
		return new Endpoint(id, Util.apiUrl(url), params, methods, $resource, CacheFactory, $q)
	}
}

export default EndpointFactoryFactory;
