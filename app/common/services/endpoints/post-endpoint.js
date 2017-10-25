module.exports = [
    '$resource',
    '$rootScope',
    'Util',
    '_',
    '$http',
function (
    $resource,
    $rootScope,
    Util,
    _,
    $http
) {

    var PostEndpoint = $resource(Util.apiUrl('/posts/:id/:extra'), {
        id: '@id'
    }, {
        query: {
            method: 'GET',
            isArray: false,
            paramSerializer: '$httpParamSerializerJQLike',
            params: {
                order: 'desc',
                orderby: 'post_date'
            },
            transformResponse: (data) => {
                data = angular.fromJson(data);
                data.results = data.results.map(normalizePost);

                return data;
            }

        },
        get: {
            method: 'GET',
            transformResponse: function (data /*, header*/) {
                return normalizePost(angular.fromJson(data));
            }
        },
        save: {
            method: 'POST',
            transformResponse: function (data /*, header*/) {
                return normalizePost(angular.fromJson(data));
            }
        },
        update: {
            method: 'PUT',
            transformResponse: function (data /*, header*/) {
                return normalizePost(angular.fromJson(data));
            }
        },
        options: {
            method: 'OPTIONS'
        },
        geojson: {
            method: 'GET',
            url: Util.apiUrl('/posts/:id/geojson'),
            isArray: false,
            paramSerializer: '$httpParamSerializerJQLike',
            cancellable: true
        },
        stats: {
            method: 'GET',
            url: Util.apiUrl('/posts/:id/stats'),
            isArray: false,
            paramSerializer: '$httpParamSerializerJQLike'
        },
        collections: {
            method: 'GET',
            url: Util.apiUrl('/posts/:id/collections'),
            isArray: true
        }
    });

    PostEndpoint.export = function (filters) {
        var config =  {
            params: filters,
            paramSerializer: '$httpParamSerializerJQLike'
        };

        return $http.get(Util.apiUrl('/posts/export'), config);
    };

    $rootScope.$on('event:authentication:logout:succeeded', function () {
        PostEndpoint.query();
    });

    function normalizePost(post) {
        // Ensure values is always an object
        if (_.isArray(post.values)) {
            post.values = _.object(post.values);
        }
        if (!_.isArray(post.published_to)) {
            post.published_to = [];
        }

        return post;
    }

    return PostEndpoint;

}];
