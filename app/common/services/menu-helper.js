/**
 * Minimalist menu system
 *
 * Exists primarily so that plugins can add menu items
 */

module.exports = ['_', '$injector', function (_, $injector) {
    return function MenuHelper (menus) {
        /**
         * Menus
         * @type {Object}
         */
        this.menus = menus;

        /**
         * Get menu items
         * @param  {string} menu Menu id
         * @return {Array}
         */
        this.getMenuItems = function (menu) {
            var menuItems = this.menus[menu];

            return _.filter(menuItems, function (item) {
                // Evaluate any conditions
                if (angular.isDefined(item.condition)) {
                    return $injector.invoke(item.condition);
                }

                return true;
            });
        }
    };
}];
