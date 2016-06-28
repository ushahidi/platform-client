module.exports = PostFiltersService;

PostFiltersService.$inject = ['_', 'FormEndpoint'];
function PostFiltersService(_, FormEndpoint) {
    // Create initial filter state
    var filterState = window.filterState = getDefaults();
    var forms = [];

    // @todo take this out of the service
    // but ensure it happens at the right times
    activate();

    return {
        getDefaults: getDefaults,
        getQueryParams: getQueryParams,
        getFilters: getFilters,
        setFilters: setFilters,
        clearFilters: clearFilters,
        clearFilter: clearFilter,
        hasFilters: hasFilters
    };

    function activate() {
        FormEndpoint.query().$promise.then(function (results) {
            forms = results;
            filterState.form = filterState.form || [];
            if (filterState.form.length === 0) { // just in case of race conditions
                Array.prototype.splice.apply(filterState.form, [0, 0].concat(_.pluck(forms, 'id')));
            }
        });
    }

    // Get filterState
    function getFilters() {
        return filterState;
    }

    function setFilters(newState) {
        // Replace filterState with defaults + newState
        // Including defaults ensures all values are always defined
        return angular.merge(filterState, getDefaults(), newState);
    }

    function clearFilters() {
        return angular.copy(getDefaults(), filterState);
    }

    function clearFilter(filterKey, value) {
        if (angular.isArray(filterState[filterKey])) {
            filterState[filterKey] = _.without(filterState[filterKey], value);
        } else {
            filterState[filterKey] = getDefaults()[filterKey];
        }
    }

    function getDefaults() {
        return {
            q: '',
            created_after: '',
            created_before: '',
            status: 'all',
            published_to: '',
            center_point: '',
            within_km: '1',
            current_stage: [],
            tags: [],
            form: _.pluck(forms, 'id'),
            set: [],
            user: false
        };
    }

    function getQueryParams(filters) {
        var query = _.omit(
            filters,
            function (value, key, object) {
                // Is value empty?
                // Is it a date?
                if (_.isDate(value)) {
                    return false;
                }
                // Is it an empty object or array?
                if (_.isObject(value) || _.isArray(value)) {
                    return _.isEmpty(value);
                }
                // Or is it just falsy?
                return !value;
            }
        );

        if (filters.center_point) {
            query.center_point = filters.center_point;
            query.within_km = filters.within_km || 10;
        } else {
            delete query.within_km;
        }

        return query;
    }

    function hasFilters(filters) {
        var defaults = getDefaults();

        var diff = _.omit(
            filters,
            function (value, key, object) {
                // Ignore difference in within_km
                if (key === 'within_km') {
                    return true;
                }
                // Is the same as the default?
                if (_.isEqual(defaults[key], value)) {
                    return true;
                }
                // Is an array with all the same elements? (order doesn't matter)
                if (_.isArray(defaults[key]) && _.difference(defaults[key], value).length === 0) {
                    return true;
                }
                // Is value empty? ..and not a date object
                // _.empty only works on arrays, object and strings.
                return (_.isEmpty(value) && !_.isDate(value));
            }
        );
        return !_.isEmpty(diff);
    }
}

// clearSelected: function () {
//     var localDefaults = angular.copy(filterDefaults);
//     _.each(localDefaults, _.bind(function (value, key) {
//         this[key] = value;
//     }, this));
// },
// setSelected: function (newFilters) {
//     var localDefaults = angular.copy(filterDefaults);
//     newFilters = angular.copy(newFilters);

//     _.each(localDefaults, _.bind(function (defaultValue, key) {
//         if (_.has(newFilters, key)) {
//             this[key] = newFilters[key];
//         } else {
//             this[key] = defaultValue;
//         }
//     }, this));
// },
