module.exports = PostFiltersService;

PostFiltersService.$inject = ['_', 'FormEndpoint', 'TagEndpoint', 'RoleEndpoint',
    'UserEndpoint', 'SavedSearchEndpoint', 'PostMetadataService', '$translate', '$filter'];
function PostFiltersService(_, FormEndpoint, TagEndpoint, RoleEndpoint,
                            UserEndpoint, SavedSearchEndpoint, PostMetadataService, $translate, $filter) {
    var roles, users, tags, forms, savedSearches = [];
    var ret = {
        requestsFiltersData: requestsFiltersData,
        transformers: transformers,
        rawFilters: {}
    };
    var requestsFiltersData = function () {

        RoleEndpoint.query().$promise.then(function (results) {
            roles = _.indexBy(results, 'name');
        });
        UserEndpoint.query().$promise.then(function (results) {
            users = _.indexBy(results.results, 'id');
        });
        TagEndpoint.query().$promise.then(function (results) {
            tags = _.indexBy(results, 'id');
        });
        FormEndpoint.query().$promise.then(function (results) {
            forms = _.indexBy(results, 'id');
        });
        SavedSearchEndpoint.query({}).$promise.then(function (searches) {
            savedSearches = _.indexBy(searches, 'id');
        });
    };
    var transformers = {
        order_unlocked_on_top: function (value) {
            var boolText = value === 'true' ? 'yes' : 'no';
            return $translate.instant('global_filter.filter_tabs.order_group.unlocked_on_top_' + boolText);
        },
        order_order: function (value) {
            return $translate.instant('global_filter.filter_tabs.order_group_order.' + value.order);
        },
        order_by: function (value) {
            return $translate.instant('global_filter.filter_tabs.order_group.order_by.' + value);
        },
        tags : function (value) {
            return tags[value] ? tags[value].tag : value;
        },
        user : function (value) {
            return users[value] ? users[value].realname : value;
        },
        saved_search: function (value) {
            return savedSearches[value] ? savedSearches[value].name : value;
        },
        center_point : function (value) {
            return $translate.instant('global_filter.filter_tabs.location_value', {
                value: ret.rawFilters.location_text ? ret.rawFilters.location_text : value,
                km: ret.rawFilters.within_km
            });
        },
        created_before : function (value) {
            return $filter('date', 'longdate')(value);
        },
        created_after : function (value) {
            return $filter('date', 'longdate')(value);
        },
        date_before : function (value) {
            return $filter('date', 'longdate')(value);
        },
        date_after : function (value) {
            return $filter('date', 'longdate')(value);
        },
        status : function (value) {
            return $translate.instant('post.' + value);
        },
        source : function (value) {
            return PostMetadataService.formatSource(value);
        },
        form: function (value) {
            return forms[value] ? forms[value].name : value;
        }
    };
    return ret;
}
