describe('view helper', function () {

    var ViewHelper;

    beforeEach(function () {
        makeTestApp()
        .service('ViewHelper', require('app/common/services/view-helper.js'))
        .service('ConfigEndpoint', function () {
            return {
                get : function () {}
            };
        })
        .factory('BootstrapConfig', function () {
            return { map: {}, site: {}, features: {} };
        });

        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.inject(function (_ViewHelper_) {
        ViewHelper = _ViewHelper_;
    }));

    it('should return view and display name for map and list', function () {
        var views = ViewHelper.views();
        expect(_.pluck(views, 'name')).toEqual(['map', 'list']);
        expect(_.pluck(views, 'display_name')).toEqual(['views.map', 'views.list']);
    });
});
