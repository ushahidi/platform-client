module.exports = [
    '$resource',
    '$rootScope',
    'Util',
function (
    $resource,
    $rootScope,
    Util
) {

    var PostEndpoint = $resource(Util.apiUrl('/posts/:id/:extra'), {
        id: '@id'
    }, {
        query: {
            method: 'GET',
            isArray: false,
            transformResponse: function (data /*, header*/) {
                return angular.fromJson(data);
            }
        },
        update: {
            method: 'PUT'
        },
        options: {
            method: 'OPTIONS'
        },
        geojson: {
            method: 'GET',
            url: Util.apiUrl('/posts/:id/geojson'),
            isArray: false,
            transformResponse: function (data /*, header*/) {
                return angular.fromJson(data);
            }
        },
        stats: {
            method: 'GET',
            url: Util.apiUrl('/posts/:id/stats'),
            isArray: false,
            transformResponse: function (data /*, header*/) {
                return angular.fromJson(data);
            }
        }
    });

    $rootScope.$on('event:authentication:logout:succeeded', function () {
        PostEndpoint.query();
    });

    return PostEndpoint;

}];
