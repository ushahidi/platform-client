module.exports = [
    '$translate',
function (
    $translate
) {
    var allViews = [
        {
            name: 'map',
            display_name: $translate.instant('views.map')
        },
        {
            name: 'list',
            display_name: $translate.instant('views.list')
        }
    ];

    function views() {
        return allViews;
    }

    return {
        views: views
    };
}];
