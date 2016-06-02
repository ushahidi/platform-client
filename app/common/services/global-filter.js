module.exports = [
    'TagEndpoint',
    'FormEndpoint',
    'FormStageEndpoint',
    'CollectionEndpoint',
    'Util',
    '_',
function (
    TagEndpoint,
    FormEndpoint,
    FormStageEndpoint,
    CollectionEndpoint,
    Util,
    _
) {

    var filterDefaults = {
        q: '',
        created_after: '',
        created_before: '',
        status: 'all',
        center_point: '',
        within_km: '1',
        current_stage: [],
        tags: [],
        form: [],
        set: []
    };

    var GlobalFilter = {
        options: {
            tags : {},
            forms : {},
            collections : {},
            postStages : {}
        },
        hasSelectedTags: function () {
            return !_.isEmpty(this.tags);
        },
        hasSelectedForms: function () {
            return !_.isEmpty(this.form);
        },
        hasSelectedPostStages: function () {
            return !_.isEmpty(this.current_stage);
        },
        hasSelectedCollections: function () {
            return !_.isEmpty(this.set);
        },
        getPostQuery: function () {
            var query = _.omit(
                _.pick(this, 'tags', 'form', 'current_stage', 'set', 'status', 'q', 'created_after', 'created_before'),
                function (value, key, object) {
                    // Is value empty? ..and not a date object
                    // _.empty only works on arrays, object and strings.
                    if (_.isObject(value) || _.isArray(value)) {
                        return _.isEmpty(value);
                    }
                    return !value;
                }
            );

            if (this.center_point) {
                query.center_point = this.center_point;
                query.within_km = this.within_km || 10;
            }

            return query;
        },
        getFilterCount: function () {
            return _.keys(this.getPostQuery()).length;
        },
        clearSelected: function () {
            var localDefaults = angular.copy(filterDefaults);
            _.each(localDefaults, _.bind(function (value, key) {
                this[key] = value;
            }, this));
        },
        setSelected: function (newFilters) {
            var localDefaults = angular.copy(filterDefaults);
            newFilters = angular.copy(newFilters);

            _.each(localDefaults, _.bind(function (defaultValue, key) {
                if (_.has(newFilters, key)) {
                    this[key] = newFilters[key];
                } else {
                    this[key] = defaultValue;
                }
            }, this));
        },
        getDefaults: function () {
            return angular.copy(filterDefaults);
        },
        loadInitialData: function () {
            TagEndpoint.query().$promise.then(function (tags) {
                GlobalFilter.options.tags = _.indexBy(tags, 'id');
            });

            CollectionEndpoint.query().$promise.then(function (collections) {
                GlobalFilter.options.collections = _.indexBy(collections, 'id');
            });

            FormEndpoint.query().$promise.then(function (response) {
                GlobalFilter.options.forms = _.indexBy(response, 'id');

                _.each(GlobalFilter.options.forms, function (form, formid) {
                    FormStageEndpoint.query({formId: formid}).$promise.then(function (response) {
                        if (response.length) {
                            GlobalFilter.options.postStages[formid] = response;
                        }
                    });
                });
            });
        }
    };

    // Add default filter values
    GlobalFilter.clearSelected();
    // Load initial data
    GlobalFilter.loadInitialData();
    GlobalFilter.options.postStatuses = ['draft', 'published'];

    return Util.bindAllFunctionsToSelf(GlobalFilter);

}];
