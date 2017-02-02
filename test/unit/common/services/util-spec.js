describe('Util', function () {

    var Util, CONST;

    beforeEach(function () {
        makeTestApp();
    });

    beforeEach(angular.mock.module('testApp'));

    beforeEach(angular.mock.inject(function (_Util_, _CONST_) {
        Util = _Util_;
        CONST = _CONST_;
    }));

    describe('url', function () {
        it('returns the absolute url for the given relative url', function () {
            expect(Util.url('/suburl')).toEqual(CONST.BACKEND_URL + '/suburl');
        });
    });

    describe('apiUrl', function () {
        it('returns the absolute api url for the given relative url', function () {
            expect(Util.apiUrl('/suburl')).toEqual(CONST.API_URL + '/suburl');
        });
    });

    describe('transformResponse', function () {
        var responseString = '{ ' +
            '"id": "map", ' +
            '"another_key": "another_value", ' +
            '"url": "http://ushahidi-backend/api/v2/config/map", ' +
            '"allowed_methods": [ ' +
                '"get", ' +
                '"post", ' +
                '"put", ' +
                '"delete" ' +
            '] ' +
        '}';

        it('returns the response string as a parsed hash without "url" and ' +
        '"allowed_methods" keys', function () {
            expect(Util.transformResponse(responseString)).toEqual(
                {
                    'id': 'map',
                    'another_key': 'another_value',
                    'url': 'http://ushahidi-backend/api/v2/config/map'
                }
            );
        });
    });
});
