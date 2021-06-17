module.exports = [
    'FontAwesomeIcons',
    'Util',
    '_',
    'Notify',
function (
    FontAwesomeIcons,
    Util,
    _,
    Notify
) {

    var iconSets = {
        fontAwesome: FontAwesomeIcons.getIconSet(),
        noun: {}
    };

    var IconManager = {

        getIconSetArray: function (iconLibName) {
            var iconSetArray = [];
            var iconLibNames = iconLibName.split(' ');

            // @todo: simplify this to reduce loops
            // push array construction to the endpoint
            // and/or store values with prefix already attached
            _.each(iconLibNames, function (libName) {
                var classPrefix = iconSets[libName].iconClass + ' ' + iconSets[libName].iconClassPrefix;
                _.each(iconSets[libName].icons, function (icon) {
                    iconSetArray.push(
                        classPrefix + icon
                    );
                });
            });

            return iconSetArray;
        }
    };

    return Util.bindAllFunctionsToSelf(IconManager);
}];

