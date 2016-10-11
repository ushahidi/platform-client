var ROOT_PATH = '../../../../';

describe('view helper', function () {

    var ViewHelper;

    beforeEach(function () {
        var testApp = angular.module('testApp', [
        'ushahidi.mock',
        'ngResource',
        'pascalprecht.translate'
        ])
        .service('ViewHelper', require('app/common/services/view-helper.js'))
        .service('ConfigEndpoint', function () {
            return {
                get : function () {}
            };
        })
        .factory('BootstrapConfig', function () {
            return { map: {}, site: {}, features: {} };
        })
        .config(require('app/common/configs/locale-config.js'));

        require('test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.inject(function (_ViewHelper_) {
        ViewHelper = _ViewHelper_;
    }));

    it('should return view and display name for map and list', function () {
        var views = ViewHelper.views();
        expect(_.pluck(views, 'name')).toEqual(['map', 'list']);
        expect(_.pluck(views, 'display_name')).toEqual(['Map', 'Timeline']);
    });
});
