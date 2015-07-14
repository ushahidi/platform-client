module.exports = [
    'TagEndpoint',
    'FormEndpoint',
    'FormStageEndpoint',
    // 'SetEndpoint',
    'Util',
    '_',
function (
    TagEndpoint,
    FormEndpoint,
    FormStageEndpoint,
    // SetEndpoint
    Util,
    _
) {

    var filterDefaults = {
        keyword: '',
        start_date: '',
        end_date: '',
        location: '',
        status: 'all',
        within_km: '1'
    };

    var GlobalFilter = {
        tags: [],
        getSelectedTags: function () {
            return _.pluck(_.where(this.tags, { selected: true }), 'id');
        },
        hasSelectedTags: function () {
            return !_.isEmpty(this.getSelectedTags());
        },
        clearSelectedTags: function () {
            _.each(this.tags, function (tag) {
                tag.selected = false;
            });
        },
        post_types: {},
        getSelectedPostTypes: function () {
            return _.pluck(_.where(this.post_types, { selected: true }), 'id');
        },
        hasSelectedPostTypes: function () {
            return !_.isEmpty(this.getSelectedPostTypes());
        },
        clearSelectedPostTypes: function () {
            _.each(this.post_types, function (postType) {
                postType.selected = false;
            });
        },
        post_stages: {},
        getSelectedPostStages: function () {
            return _.flatten(_.map(this.post_stages, function (item) {
                return _.chain(item)
                    .where({ selected : true })
                    .pluck('id')
                    .value();
            }));
        },
        hasSelectedPostStages: function () {
            return !_.isEmpty(this.getSelectedPostStages());
        },
        clearSelectedPostStages: function () {
            _.each(this.post_stages, function (postStages) {
                _.each(postStages, function (postStage) {
                    postStage.selected = false;
                });
            });
        },
        getPostQuery: function () {
            var query = {};

            var selected_tags = this.getSelectedTags();
            if (!_.isEmpty(selected_tags)) {
                query.tags = selected_tags.join(',');
            }

            var selected_types = this.getSelectedPostTypes();
            if (!_.isEmpty(selected_types)) {
                query.form = selected_types.join(',');
            }

            var selected_stages = this.getSelectedPostStages();
            if (!_.isEmpty(selected_stages)) {
                query.current_stage = selected_stages.join(',');
            }

            query.status = this.status;

            if (this.keyword) {
                query.q = this.keyword;
            }
            if (this.start_date) {
                query.created_after = this.start_date;
            }
            if (this.end_date) {
                query.created_before = this.end_date;
            }

            if (this.location) {
                query.center_point = this.location;
                query.within_km = this.within_km || 10;
            }

            return query;
        },
        getFilterCount: function () {
            return _.keys(this.getPostQuery()).length;
        },
        clearSelected: function () {
            _.each(filterDefaults, _.bind(function (value, key) {
                this[key] = value;
            }, this));
            // Special handling for tags, post types and post statuses
            this.clearSelectedTags();
            this.clearSelectedPostTypes();
        },
        getDefaults: function () {
            return _.extend({}, filterDefaults, {
                tags: [],
                post_types: {},
                post_stages: {}
            });
        }
    };

    // Add default filter values
    angular.extend(GlobalFilter, filterDefaults);

    GlobalFilter.tags = TagEndpoint.query();

    FormEndpoint.query().$promise.then(function (response) {
       GlobalFilter.post_types = _.indexBy(response, 'id');

       _.each(GlobalFilter.post_types, function (form, formid) {
           FormStageEndpoint.query({formId: formid}).$promise.then(function (response) {
               if (response.length) {
                   GlobalFilter.post_stages[formid] = response;
               }
           });
       });
   });

    // @todo - uncomment when sets are ready
    // SetEndpoint.get().$promise.then(function(response) {
    //     GlobalFilter.sets = response.results;
    // });

    GlobalFilter.post_statuses = ['draft', 'published'];

    return Util.bindAllFunctionsToSelf(GlobalFilter);

}];
