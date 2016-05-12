var ROOT_PATH = '../../../../';

describe('view helper', function () {

    var ViewHelper;

    beforeEach(function () {
        var testApp = angular.module('testApp', [
        'ushahidi.mock',
        'ngResource',
        'pascalprecht.translate'
        ])
        .service('ViewHelper', require(ROOT_PATH + 'app/common/services/view-helper.js'))
        .service('ConfigEndpoint', function () {
            return {
                get : function () {}
            };
        })
        .factory('BootstrapConfig', function () {
            return { map: {}, site: {}, features: {} };
        })
        .config(require(ROOT_PATH + 'app/common/configs/locale-config.js'));

        require(ROOT_PATH + 'test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(inject(function (_ViewHelper_) {
        ViewHelper = _ViewHelper_;
    }));

    describe('some existing view names', function () {
        var existingViews;

        beforeEach(function () {
            existingViews = [
                {
                    name: 'map',
                    display_name: 'Map'
                }
            ];
        });

        describe('returned view', function () {

            var returnedView;

            describe('with an existing view name', function () {

                beforeEach(function () {
                    returnedView = ViewHelper.getView('map', existingViews);
                });

                it('should return the display_name for the view name', function () {
                    expect(returnedView).toEqual('Map');
                });
            });

            describe('with an non existing view name', function () {
                beforeEach(function () {
                    returnedView = ViewHelper.getView('foo', existingViews);
                });

                it('should return the value of the input view', function () {
                    expect(returnedView).toEqual('foo');
                });
            });

        });
    });
});
