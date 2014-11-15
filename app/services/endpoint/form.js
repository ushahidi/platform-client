module.exports = [
    '$resource',
    'Util',
function(
    $resource,
    Util
) {

    var FormEndpoint = $resource(Util.apiUrl('/forms/:formId'), {}, {
        query: {
            method: 'GET',
            isArray: true,
            transformResponse: function(data /*, header*/) {
                return Util.transformResponse(data).results;
            }
        }
    });

    return FormEndpoint;

}];
