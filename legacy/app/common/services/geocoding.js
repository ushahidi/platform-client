module.exports = [
    '$q',
    '$http',
    '_',
function (
    $q,
    $http,
    _
) {
    return {
        searchCoordinates: searchCoordinates,
        searchAllInfo: searchAllInfo
    };

    function searchCoordinates(location_name) {
        return build_query(location_name).then(function (results) {
            if (results && results[0]) {
                if (results[0].lat && results[0].lon) {
                    return [parseFloat(results[0].lat), parseFloat(results[0].lon)];
                }
            }

            return null;
        });
    }

    function searchAllInfo(location_name) {
        return build_query(location_name).then(function (results) {
            if (results && results[0]) {
                return results;
            }
            return null;
        });
    }

    function build_query(location_name) {
        if (window.googlePlaces) { /* google maps */
            return google_places_search(location_name);
        } else { /* osm nominatim */
            return osm_geosearch(location_name);
        }
    }

    function osm_geosearch(location_name) {
        return $http({
            method: 'GET',
            url: '//nominatim.openstreetmap.org/search',
            params: { q: location_name, format: 'json' }
        }).then((response) => {
            return response.data;
        }, () => {
            // noop
        });
    }

    function google_places_search(location_name) {
        var deferred = $q.defer();
        window.googlePlaces.textSearch({ query: location_name }, function (results) {
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
        return deferred.promise;
    }

}];
