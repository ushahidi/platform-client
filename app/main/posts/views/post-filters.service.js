module.exports = PostFiltersService;

PostFiltersService.$inject = ['_', 'FormEndpoint', 'TagEndpoint', '$q'];
function PostFiltersService(_, FormEndpoint, TagEndpoint, $q) {
    // Create initial filter state
    var filterState = window.filterState = getDefaults();
    var forms = [];
    var tags = [];
    var filterMode = 'all';
    var entity = null;
    // @todo take this out of the service
    // but ensure it happens at the right times
    activate();

    return {
        resetDefaults: resetDefaults,
        getDefaults: getDefaults,
        getQueryParams: getQueryParams,
        getFilters: getFilters,
        setFilters: setFilters,
        setFilter: setFilter,
        clearFilters: clearFilters,
        clearFilter: clearFilter,
        clearFilterFromArray: clearFilterFromArray,
        hasFilters: hasFilters,
        getActiveFilters: getActiveFilters,
        getUIActiveFilters: getUIActiveFilters,
        setMode: setMode,
        getMode: getMode,
        getModeId: getModeId,
        getModeEntity: getModeEntity,
        countFilters: countFilters,
        cleanUIFilters: cleanUIFilters,
        cleanRemovedValuesFromObject: cleanRemovedValuesFromObject,
        addIfCurrentObjectMatchesOriginal: addIfCurrentObjectMatchesOriginal,
        reactiveFilters: true,
        qEnabled: false
    };

    /**
     * Removes every value that is not an array from the "target" object IF the key is present in the "from" object.
     * For array values it runs a diff between the "target" and "from" current value:
     * - if it' empty, DELETES the key from "target"
     * - if not empty, assigns the diff in "target"
     * Finally this returns the target object to be used elsewhere.
     * The function was created for the uiFilters specifically.
     * @param target
     * @param from
     * @returns object
     */
    function cleanUIFilters(target, from) {
        _.each(target, function (value, key) {
            var shouldDeleteTargetKey = !_.isArray(target[key]) && target.hasOwnProperty(key) && !_.isEmpty(from[key]) || !_.isArray(target[key]) && target[key] === getDefaults()[key];
            if (shouldDeleteTargetKey) {
                delete target[key];
            } else if (_.isArray(target[key])) {
                var diff =  _.difference(value, from[key]);
                if (diff.length === 0) {
                    delete target[key];
                } else {
                    target[key] = diff;
                }
            }
        });
        return target;
    }
    /**
     *  Original has 3 filters, then 1 was removed, so current has 2. uiFiltersCurrent has 3 again because the user re-added it.
     *  We need to compare  original and uiFIltersCurrent.
     *  If `uiFiltersCurrent` has values that are present in  `original`,
     *  we need to add them to `current` (*some other function will remove them from uiFiltersCurrent too)
     *
     * @param current
     * @param original
     */
    function addIfCurrentObjectMatchesOriginal(currentSavedSearch, originalSavedSearch, currentFilters) {
        //find filters in current that are part of the original object
        return _.mapObject(originalSavedSearch, function (obj, key) {
            if (!_.isArray(obj)) {
                return currentFilters[key];
            }
            var currentContainsOriginalSavedSearch = _.every(originalSavedSearch[key], function (obj) {
                return _.contains(currentFilters[key], obj);
            });
            if (currentContainsOriginalSavedSearch) {
                return _.intersection(originalSavedSearch[key], currentFilters[key]);
            } else {
                return _.intersection(currentSavedSearch[key], currentFilters[key]);
            }
        });
    }
    /**
     * Looks for keys that are NOT present in currentFilters but that are in the savedSearch filters (which means they are removed)
     * and removes them from the saved search filters array.
     * Does not handle removal where the key exists but the values are an array and some are missing. Need to fix that.
     **/
    function cleanRemovedValuesFromObject(currentFilters, oldFilters) {
        //find filters in currentFilters that are NOT in savedSearch.filters
        var validFilters = _.pick(oldFilters, _.without(_.keys(currentFilters), _.keys(oldFilters)));
        validFilters = _.mapObject(validFilters, function (obj, key) {
            if (!_.isArray(oldFilters[key])) {
                return currentFilters[key];
            }
            return _.filter(oldFilters[key], function (val) {
                return currentFilters[key].indexOf(val) > -1;
            });
        });
        return validFilters;
    }

    /**
     * function to deal with the fact that logout and login don't really reset the defaults.
     */
    function resetDefaults() {
        return activate().then(() => {
            this.clearFilters();
        });
    }

    function activate() {
        return $q.all([TagEndpoint.query().$promise, FormEndpoint.query().$promise]).then(function (results) {
            tags = _.pluck(results[0], 'id');
            forms = results[1];
            // adding incoming messages to filter
            forms.push({id: 'none'});
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
        // Replace 'all' with full list of statuses
        // Gives less confusing active display, and works around API bug
        if (newState.status === 'all') {
            newState.status = ['published', 'draft', 'archived'];
        }

        // Replace filterState with defaults + newState
        // Including defaults ensures all values are always defined
        return angular.extend(filterState, getDefaults(), newState);
    }

    function setFilter(key, value) {
        filterState[key] = value;
        return filterState;
    }

    function clearFilters() {
        // Replace filterState with defaults
        angular.copy(getDefaults(), filterState);
        // Trigger reactive filters
        this.reactiveFilters = true;
        return filterState;
    }

    function clearFilter(filterKey, value) {
        filterState = this.clearFilterFromArray(filterKey, value, filterState);
    }
    function clearFilterFromArray(filterKey, value, from) {
        /*
         * if filter is in an array, we only want to remove that specific value
         * if all filter-values are removed from array, we want to reset to default
         */
        if (Array.isArray(from[filterKey]) && from[filterKey].length > 1) {
            from[filterKey].splice(from[filterKey].indexOf(value), 1);
        } else {
            from[filterKey] = getDefaults()[filterKey];
        }

        /**
         * Since q is a special type of filter that gets applied on the click
         * of a button separate from the input control, and since it should be automatically
         * enabled when you clear it, we are adding this
         */
        if (filterKey === 'q') {
            this.qEnabled = true;
            this.reactiveFilters = true;
        }
        return from;
    }

    function getDefaults() {
        return {
            q: '',
            date_after: '',
            date_before: '',
            status: filterMode === 'collection' ? ['published', 'draft', 'archived'] : ['published', 'draft'],
            published_to: '',
            center_point: '',
            has_location: 'all',
            within_km: '1',
            current_stage: [],
            tags: tags,
            saved_search: '',
            orderby: 'created',
            order: 'desc',
            order_unlocked_on_top: 'true',
            form: _.pluck(forms, 'id'),
            set: [],
            user: false,
            source: ['sms', 'twitter','web', 'email']
        };
    }

    function getQueryParams(filters) {
        var defaults = getDefaults();
        var query = _.omit(
            filters,
            function (value, key, object) {
                if (key === 'saved_search') {
                    return true;
                }
                if (key === 'reactiveFilters') {
                    return true;
                }
                if (key === 'qEnabled') {
                    return true;
                }
                // Is value empty?
                // Is it a date?
                if (_.isDate(value)) {
                    return false;
                }

                // Is an array with all the same elements? (order doesn't matter)
                if ((key === 'tags' || key === 'form') && _.isArray(defaults[key]) &&
                    _.difference(value, defaults[key]).length === 0 &&
                    _.difference(defaults[key], value).length === 0) {
                    return true;
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
        if (filterMode === 'collection') {
            query.set = [getModeId()].concat(query.set);
        }
        return query;
    }

    /**
     * For UI purposes only
     * Returns the non-default filters so that we don' show the user 3 filters when they didn' select one yet
     * Example: when the active filters load we show "sort", "unlockedOnTop", "sort_by" as active with their value
     * but since the user didn't select a filter, it can be really confusing.
     * @param filters
     */
    function getUIActiveFilters(filters) {
        var defaults = getDefaults();
        return _.omit(
            filters,
            function (value, key, object) {
                if (defaults[key] === value) {
                    return true;
                }
                // Ignore difference in saved_search
                if (key === 'saved_search') {
                    return true;
                }
                // Ignore difference in within_km
                if (key === 'within_km') {
                    return true;
                }
                // Is the same as the default?
                if (_.isEqual(defaults[key], value)) {
                    return true;
                }
                // Is an array with all the same elements? (order doesn't matter)
                if (_.isArray(defaults[key]) &&
                    _.difference(value, defaults[key]).length === 0 &&
                    _.difference(defaults[key], value).length === 0) {
                    return true;
                }
                // Is value empty? ..and not a date object
                // _.empty only works on arrays, object and strings.
                return (_.isEmpty(value) && !_.isDate(value));
            }
        );
    }

    /**
     * Gets the real active filters, including defaults.
     * @param filters
     */
    function getActiveFilters(filters) {
        var defaults = getDefaults();
        return _.omit(
            filters,
            function (value, key, object) {
                if (key === 'reactiveFilters') {
                    return true;
                }
                // Ignore difference in saved_search
                if (key === 'saved_search') {
                    return true;
                }
                if (key === 'qEnabled') {
                    return true;
                }
                // Ignore difference in within_km
                if (key === 'within_km') {
                    return true;
                }
                // Is the same as the default?
                if (_.isEqual(defaults[key], value)) {
                    return true;
                }
                // Is an array with all the same elements? (order doesn't matter)
                if (_.isArray(defaults[key]) &&
                    _.difference(value, defaults[key]).length === 0 &&
                    _.difference(defaults[key], value).length === 0) {
                    return true;
                }
                // Is value empty? ..and not a date object
                // _.empty only works on arrays, object and strings.
                return (_.isEmpty(value) && !_.isDate(value));
            }
        );
    }

    function hasFilters(filters) {
        return !_.isEmpty(getActiveFilters(filters));
    }

    function setMode(newMode, obj) {
        // If mode changes, reset filters
        if (newMode !== filterMode) {
            filterMode = newMode;
            if (filterMode === 'collection') {
                this.clearFilters();
            }

        }
        entity = obj;
    }

    function getMode() {
        return filterMode;
    }

    function getModeId() {
        return entity ? entity.id : null;
    }

    function getModeEntity(type) {
        if (getMode() === type) {
            return entity;
        }
        return null;
    }
    function countFilters() {
        return _.keys(this.getActiveFilters(this.getFilters())).length;
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
