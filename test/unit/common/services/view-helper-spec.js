var ROOT_PATH = '../../../../';

describe('view helper', function () {

    var PostViewHelper;

    beforeEach(function () {
        var testApp = angular.module('testApp', [
        'pascalprecht.translate'
        ])
        .service('PostViewHelper', require(ROOT_PATH + 'app/common/services/view-helper.js'))
        .config(require(ROOT_PATH + 'app/common/configs/locale-config.js'));

        require(ROOT_PATH + 'test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(inject(function (_PostViewHelper_) {
        PostViewHelper = _PostViewHelper_;
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
                    returnedView = PostViewHelper.getView('map', existingViews);
                });

                it('should return the display_name for the view name', function () {
                    expect(returnedView).toEqual('Map');
                });
            });

            describe('with an non existing view name', function () {
                beforeEach(function () {
                    returnedView = PostViewHelper.getView('foo', existingViews);
                });

                it('should return the value of the input view', function () {
                    expect(returnedView).toEqual('foo');
                });
            });

        });
    });
});
