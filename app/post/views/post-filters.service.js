module.exports = PostFiltersService;

PostFiltersService.inject = ['_', 'FormEndpoint'];
function PostFiltersService(_, FormEndpoint) {
    // Create initial filter state
    var filterState = window.filterState = getDefaults();

    // @todo take this out of the service
    // but ensure it happens at the right times
    activate();

    return {
        getDefaults: getDefaults,
        getQueryParams: getQueryParams,
        getFilters: getFilters,
        setFilters: setFilters,
        clearFilters: clearFilters,
        hasFilters: hasFilters
    };

    function activate() {
        FormEndpoint.query().$promise.then(function (forms) {
            if (filterState.form.length == 0) { // just in case of race conditions
                Array.prototype.splice.apply(filterState.form, [0, 0].concat(_.pluck(forms, 'id')));
            }
        });
    }

    // Get filterState
    function getFilters() {
        return filterState;
    }

    function setFilters(newState) {
        return angular.copy(newState, filterState);
    }

    function clearFilters() {
        return angular.copy(getDefaults(), filterState);
    }

    function getDefaults() {
        return {
            q: '',
            created_after: '',
            created_before: '',
            status: 'published',
            published_to: '',
            center_point: '',
            within_km: '1',
            current_stage: [],
            tags: [],
            form: [],
            set: []
        };
    }

    function getQueryParams(filters) {
        var query = _.omit(
            filters,
            function (value, key, object) {
                // Is value empty? ..and not a date object
                // _.empty only works on arrays, object and strings.
                return (_.isEmpty(value) && !_.isDate(value));
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
        var defaults = getDefaults(),

        diff = _.omit(
            filters,
            function (value, key, object) {
                // Ignore difference in within_km
                if (key == 'within_km') {
                    return true;
                }
                // Is the same as the default?
                if (defaults[key] == value) {
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
