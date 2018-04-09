module.exports = [
    '$resource',
    'Util',
function (
    $resource,
    Util
) {

    var FormStatsEndpoint = $resource(Util.apiUrl('/forms/:formId/stats/'), {
        formId: '@formId'
    }, {
        query: {
            method: 'GET',
            isArray: false,
            transformResponse: function (data /*, header*/) {
                return angular.fromJson(data);
            }
        },
        get: {
            method: 'GET'
        }
    });

    return FormStatsEndpoint;
}];
