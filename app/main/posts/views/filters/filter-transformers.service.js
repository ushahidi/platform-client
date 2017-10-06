module.exports = FilterTransformersService;

FilterTransformersService.$inject = ['_', 'FormEndpoint', 'TagEndpoint', 'RoleEndpoint',
    'UserEndpoint', 'SavedSearchEndpoint', 'PostMetadataService', '$translate', '$filter'];
function FilterTransformersService(_, FormEndpoint, TagEndpoint, RoleEndpoint,
                            UserEndpoint, SavedSearchEndpoint, PostMetadataService, $translate, $filter) {
    var roles, users, tags, forms, savedSearches = [];
    var self = this;
    this.rawFilters = {};
    this.requestsFiltersData = function () {
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
    this.transformers = {
        order_unlocked_on_top: function (value) {
            var boolText = value === 'true' ? 'yes' : 'no';
            return $translate.instant('global_filter.filter_tabs.order_group.unlocked_on_top_' + boolText);
        },
        order: function (value) {
            return $translate.instant('global_filter.filter_tabs.order_group.order.' + value.toLowerCase());
        },
        orderby: function (value) {
            return $translate.instant('global_filter.filter_tabs.order_group.orderby.' + value);
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
                value: self.rawFilters.location_text ? this.rawFilters.location_text : value,
                km: self.rawFilters.within_km
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
    return self;
}
