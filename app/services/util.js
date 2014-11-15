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
        }
    };

    // All Util functions should always have Util as their 'this' context
    _.bindAll.apply(_, [Util].concat(_.functions(Util)));

    return Util;

}];
