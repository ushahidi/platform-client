module.exports = [
    '_',
    'Features',
    '$translate',
    '$q',
function (
    _,
    Features,
    $translate,
    $q
) {
    var allViews = [
            {
                name: 'map',
                display_name: $translate.instant('views.map')
            },
            {
                name: 'list',
                display_name: $translate.instant('views.list')
            },
            {
                name: 'activity',
                display_name: $translate.instant('views.activity')
            }
            // {
            //     name: 'chart',
            //     display_name: $translate.instant('views.chart')
            // },
            // {
            //     name: 'timeline',
            //     display_name: $translate.instant('views.timeline')
            // }
        ],
        availableViews = [],
        availableViewsDeferred = $q.defer(),

    ViewHelper = {
        views: function (allViews) {
            return allViews ? allViews : availableViews;
        },
        getView: function (view, views) {
            if (!views) {
                views = allViews;
            }
            var match = _.findWhere(views, {name: view});
            return match ? match.display_name : view;
        },
        isViewAvailable: function (view) {
            return availableViewsDeferred.promise.then(function (availableViews) {
                return _.findWhere(availableViews, {name: view});
            });
        },
        getDefault: function (views) {
            if (!views) {
                views = allViews;
            }

            // default view is set to map for the time being.
            var match = _.findWhere(views, {name: ''});
            return match ? match.display_name : 'Map';
        }
    };

    // Push available views into array
    // Rely on JS magic to
    var populateAvailableView = function (featureConfig) {
        _.each(allViews, function (view) {
            if (featureConfig.views[view.name]) {
                availableViews.push(view);
            }
        });
        availableViewsDeferred.resolve(availableViews);
    };
    Features.loadFeatures().then(function (features) {
        populateAvailableView(features);
    });

    return ViewHelper;
}];
