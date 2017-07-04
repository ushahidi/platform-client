module.exports = [
    '$q',
    '$resource',
    'Util',
    '_',
function (
    $q,
    $resource,
    Util,
    _
) {
    var osm_geosearch = $resource('//nominatim.openstreetmap.org/search',
                { format: 'json' },
                {
                    query: {
                        method: 'GET',
                        isArray: true
                    }
                }
            );

    var Geocoding = {
        searchCoordinates: function (location_name) {
            return osm_geosearch.query({ q: location_name }).$promise.then(function (results) {
                if (results && results[0]) {
                    if (results[0].lat && results[0].lon) {
                        return [parseFloat(results[0].lat), parseFloat(results[0].lon)];
                    }
                }

                return null;
            });
        },
        searchAllInfo: function (location_name) {
            return osm_geosearch.query({q: location_name}).$promise.then(function (results) {
                if (results && results[0]) {
                    return results;
                }
                return null;
            });
        }
    };

    return Util.bindAllFunctionsToSelf(Geocoding);

}];
