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
        start_date: '',
        end_date: '',
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
            tags : [],
            forms : {},
            collections : [],
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
            var query = {};

            if (!_.isEmpty(this.tags)) {
                query.tags = this.tags.join(',');
            }

            if (!_.isEmpty(this.form)) {
                query.form = this.form.join(',');
            }

            if (!_.isEmpty(this.current_stage)) {
                query.current_stage = this.current_stage.join(',');
            }

            if (!_.isEmpty(this.set)) {
                query.set = this.set.join(',');
            }

            query.status = this.status;

            if (this.q) {
                query.q = this.q;
            }
            if (this.start_date) {
                query.created_after = this.start_date;
            }
            if (this.end_date) {
                query.created_before = this.end_date;
            }

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
            return _.extend({}, filterDefaults);
        }
    };

    // Add default filter values
    GlobalFilter.clearSelected();

    GlobalFilter.options.tags = TagEndpoint.query();
    GlobalFilter.options.collections = CollectionEndpoint.query();

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

    GlobalFilter.options.postStatuses = ['draft', 'published'];

    return Util.bindAllFunctionsToSelf(GlobalFilter);

}];
