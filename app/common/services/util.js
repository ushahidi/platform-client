module.exports = [
    '_',
    'CONST',
    '$window',
function (
    _,
    CONST,
    $window
) {

    var Util = {
        currentUrl: function () {
            return $window.location.href;
        },
        url: function (relative_url) {
            return CONST.BACKEND_URL + relative_url;
        },
        apiUrl: function (relative_url) {
            return CONST.API_URL + relative_url;
        },
        deploymentUrl: function (relative_url) {
            var pattern = /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/g;
            var deploymentUrl = pattern.exec(this.apiUrl(relative_url));
            return deploymentUrl[0].replace('api.', '');
        },
        transformResponse: function (response, omitKeys) {
            omitKeys = (omitKeys || []).concat(['allowed_methods']);
            return _.omit(angular.fromJson(response), omitKeys);
        },
        bindAllFunctionsToSelf: function (object) { // bind all functions on self to use self as their 'this' context
            var functions = _.functions(object);
            if (functions.length) {
                _.bindAll.apply(_, [object].concat(functions));
            }
            return object;
        },

        /*
         * This function returns a map of csv columns to post_type fields.
         * It checks for the presences of the columns names in the set of attribute labels.
         * If the column is not present the entry is set to undefined.
         *
         * The match is case insensistive.
         */
        autoMap: function (columns, attributes, mapSize) {
            // Get set of labels
            var attributeLabels = _.map(attributes, function (attribute) {
                return attribute.label.toLowerCase();
            });

            // Create map of labels to attribute keys
            var attributeKeys = _.pluck(attributes, 'key');
            var attributeMap = _.object(attributeLabels, attributeKeys);

            // Check if a column name appears in the set of labels, if it does set a mapping
            // to the attribute, otherwise set the mapping to undefined.
            return _.map(columns, function (item, index) {
                var column = item.toLowerCase().trim();
                return _.contains(attributeLabels, column) ? attributeMap[item] : undefined;
            });
        }
    };

    return Util.bindAllFunctionsToSelf(Util);

}];
