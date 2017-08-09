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

    var google_places_search = {
        query: function (location_name) {
            var deferred = $q.defer();
            window.googlePlaces.textSearch(location_name, function (results) {
                deferred.resolve(
                    _.map(results, function (result) {
                        return {
                            display_name: result.name + ' - ' + result.formatted_address,
                            lat: result.geometry.location.lat(),
                            lon: result.geometry.location.lng()
                        };
                    })
                );
            });
            return { $promise: deferred.promise };
        }
    };

    var build_query = function (location_name) {
        if (window.googlePlaces) { /* google maps */
            return google_places_search.query({query: location_name});
        } else { /* osm nominatim */
            return osm_geosearch.query({q: location_name});
        }
    };

    var Geocoding = {
        searchCoordinates: function (location_name) {
            return build_query(location_name).$promise.then(function (results) {
                if (results && results[0]) {
                    if (results[0].lat && results[0].lon) {
                        return [parseFloat(results[0].lat), parseFloat(results[0].lon)];
                    }
                }

                return null;
            });
        },
        searchAllInfo: function (location_name) {
            return build_query(location_name).$promise.then(function (results) {
                if (results && results[0]) {
                    return results;
                }
                return null;
            });
        }
    };

    return Util.bindAllFunctionsToSelf(Geocoding);

}];
