/**
 * Minimalist menu system
 *
 * Exists primarily so that plugins can add menu items
 */

module.exports = [function () {

    /**
     * Default menus
     * @type {Object}
     */
    var menus = {
        'main' : [
            {
                url : '/',
                text : 'nav.home'
            },
            // {
            //     url : '/about'
            //     text : 'nav.home'
            // },
            {
                url : '/activity',
                text : 'nav.activity',
                condition : ['_', '$rootScope', 'Config', function (_, $rootScope, Config) {
                    var activityIsAvailable = (typeof Config.features.views !== 'undefined') ? Config.features.views.activity : true;
                    return $rootScope.isAdmin() || activityIsAvailable;
                }]
            },
        ],
        'settings' : [
            {
                url : '/settings/general',
                text : 'nav.general'
            },
            {
                url : '/settings/map-settings',
                text : 'nav.map_settings'
            },
            {
                url : '/settings/datasources',
                text : 'nav.data_sources'
            },
            {
                url : '/settings/forms',
                text : 'nav.posts_and_entities'
            },
            {
                url : '/settings/categories',
                text : 'nav.categories'
            },
            {
                url : '/settings/users',
                text : 'nav.users'
            }
        ]
    };

    /**
     * [addMenuItem description]
     * @param {string} menu  Menu id
     * @param {Object} item  Menu item object
     * @param {Int}    index Index to insert menu item at
     */
    this.addMenuItem = function (menu, item, index) {
        if (typeof index !== 'undefined') {
            menus[menu].splice(index, 0, item);
        } else {
            menus[menu].push(item);
        }
    };

    this.$get = ['MenuHelperClass', function (MenuHelper) {
        return new MenuHelper(menus);
    }]
}];
