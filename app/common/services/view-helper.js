module.exports = [
    '_',
    'ConfigEndpoint',
    '$translate',
function (
    _,
    ConfigEndpoint,
    $translate
) {
    var allViews = [
            {
                name: 'map',
                display_name: $translate.instant('view_tabs.map')
            },
            {
                name: 'list',
                display_name: $translate.instant('view_tabs.list')
            },
            {
                name: 'chart',
                display_name: $translate.instant('view_tabs.chart')
            },
            {
                name: 'timeline',
                display_name: $translate.instant('view_tabs.timeline')
            }
        ],
        availableViews = [],

    PostViewHelper = {
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
            return _.findWhere(availableViews, {name: view});
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

    ConfigEndpoint.get({ id: 'features' }, function (features) {
            // Push available views into array
            // Rely on JS magic to
            _.each(allViews, function (view) {
                if (features.views[view.name]) {
                    availableViews.push(view);
                }
            });
        });

    return PostViewHelper;
}];
