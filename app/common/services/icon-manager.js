module.exports = [
    'FontAwesomeEndpoint',
    'NounEndpoint',
    'Util',
    '_',
    'Notify',
function (
    FontAwesomeEndpoint,
    NounEndpoint,
    Util,
    _,
    Notify
) {

    var iconSets = {
        fontAwesome: {},
        noun: {}
    };

    var IconManager = {

        getIconSetArray: function (iconLibName) {
          var iconSetArray = {};
          var iconLibNames = iconLibName.split(' ');

          // @todo: simplify this to reduce loops
          // push array construction to the endpoint
          // and/or store values with prefix already attached
          _.each(iconLibNames, function (libName) {
              var classPrefix = iconSets[libName].iconClassPrefix + ' ' + iconSets[libName].iconClassPrefix;
              _.each(iconSets[libName].icons, function (icon) {
                  iconSetArray.push(
                      icon.iconClass + classPrefix + icon
                  );
              });
          });

          return iconSetArray;
      }
    };

    FontAwesomeEndpoint.query().then(function (icons) {
        iconSets.fontAwesome = icons;
    }, function (errorResponse) {
        var errors = _.pluck(errorResponse.data && errorResponse.data.errors, 'message');
        errors && Notify.showAlerts(errors);
    });

    NounEndpoint.query().then(function (icons) {
        iconSets.noun = icons;
    }, function (errorResponse) {
        var errors = _.pluck(errorResponse.data && errorResponse.data.errors, 'message');
        errors && Notify.showAlerts(errors);
    });

    return Util.bindAllFunctionsToSelf(IconManager);
}];

