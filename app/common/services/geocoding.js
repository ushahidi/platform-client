module.exports = [
    '$q',
    '$http',
    'Util',
    '_',
function (
    $q,
    $http,
    Util,
    _
) {

    var Geocoding = {
        api_url: '//nominatim.openstreetmap.org/search',
        default_params: {
            format: 'json'
        },
        query: function (params) {
            var deferred = $q.defer();

            $http.get({
                    url: this.api_url,
                    params: _.extend({}, this.default_params, params)
                })
                .success(function (data, status, headers, config) {
                    deferred.resolve(data);
                })
                .error(function (data, status, headers, config) {
                    deferred.reject(null);
                })
                ;

            return deferred.promise;
        },
        search: function (location_name) {
            return this.query({ q: location_name }).then(function (result) {
                if (result && result[0] && result[0].lat && result[0].lon) {
                    return [parseFloat(result[0].lat), parseFloat(result[0].lon)];
                } else {
                    return null;
                }
            });
        }
    };

    return Util.bindAllFunctionsToSelf(Geocoding);

}];
