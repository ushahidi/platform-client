module.exports = [
    '_',
    'CONST',
function(
    _,
    CONST
) {

    var Util = {
        url: function(relative_url)
        {
            return CONST.BACKEND_URL + relative_url;
        },
        apiUrl: function(relative_url)
        {
            return CONST.API_URL + relative_url;
        },
        transformResponse: function(response, omitKeys)
        {
            omitKeys = (omitKeys || []).concat(['url', 'allowed_methods']);
            return _.omit(angular.fromJson(response), omitKeys);
        },
        bindAllFunctionsToSelf: function(object)
        { // bind all functions on self to use self as their 'this' context
            var functions = _.functions(object);
            if (functions.length) {
                _.bindAll.apply(_, [object].concat(functions));
            }
            return object;
        }
    };

    return Util.bindAllFunctionsToSelf(Util);

}];
