EndpointFactoryFactory.$inject = ['$resource', 'CacheFactory', '$q', '$httpParamSerializer', 'Util', 'Endpoint'];
function EndpointFactoryFactory($resource, CacheFactory, $q, $httpParamSerializer, Util, Endpoint) {
	return function EndpointFactory(id, url, params, methods) {
		return new Endpoint(id, Util.apiUrl(url), params, methods, $resource, CacheFactory, $q, $httpParamSerializer)
	}
}

export default EndpointFactoryFactory;
