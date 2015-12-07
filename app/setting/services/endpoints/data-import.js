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

    var DataImportEndpoint = $resource(Util.apiUrl('/csv/:id'), {
        id: '@id'
    }, {
        get: {
            method: 'GET'
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
             dfd.resolve();
        }, function (errorResponse) {
            dfd.reject(errorResponse);
        })
        return dfd.promise;
    };
    
    return DataImportEndpoint;

}];
