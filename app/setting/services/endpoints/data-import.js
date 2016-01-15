module.exports = [
    '$q',
    '$http',
    '$resource',
    '$rootScope',
    'Util',
function (
    $q,
    $http,
    $resource,
    $rootScope,
    Util
) {

    var DataImportEndpoint = $resource(Util.apiUrl('/csv/:id/:action'), {
        id: '@id',
        action: '@action'
    }, {
        get: {
            method: 'GET'
        },
        update: {
            method: 'PUT'
        },
        delete: {
            method: 'DELETE'
        },
        import: {
            method: 'POST'
        }
    });

    DataImportEndpoint.upload = function (formData) {
        var dfd = $q.defer();
        $http.post(
            Util.apiUrl('/csv'),
            formData,
            {
                headers: {
                    'Content-Type': undefined
                }
            }
        ).then(function (response) {
            dfd.resolve(Util.transformResponse(response.data));
        }, function (errorResponse) {
            dfd.reject(errorResponse);
        });
        return dfd.promise;
    };

    return DataImportEndpoint;

}];
