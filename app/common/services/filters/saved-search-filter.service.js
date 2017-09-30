module.exports = [
    '$q',
    '$http',
    '_',
    'SavedSearchEndpoint',
    function (
        $q,
        $http,
        _,
        SavedSearchEndpoint
    ) {
        var savedSearchFilter = [];
        return {
            labelTranslateKey: 'global_filter.saved_search.filter_type_tag',
            put: function (savedSearchFilters) {
                savedSearchFilter = savedSearchFilters;
            },
            add: function (savedSearchObj) {
                savedSearchFilter.push(savedSearchObj);
            },
            get: function () {
                return savedSearchFilter;
            },
            getDefaults: function () {
                return savedSearchFilter;
            },
            reset: function () {
                savedSearchFilter = this.getDefaults();
                return savedSearchFilter;
            }
        };
    }];
