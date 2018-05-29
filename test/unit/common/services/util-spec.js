/* eslint-disable */
describe("Util", () => {
    let Util, CONST;

    beforeEach(() => {
        makeTestApp();
    });

    beforeEach(angular.mock.module("testApp"));

    beforeEach(
        angular.mock.inject((_Util_, _CONST_) => {
            Util = _Util_;
            CONST = _CONST_;
        })
    );

    describe("url", () => {
        it("returns the absolute url for the given relative url", () => {
            expect(Util.url("/suburl")).toEqual(`${CONST.BACKEND_URL}/suburl`);
        });
    });

    describe("apiUrl", () => {
        it("returns the absolute api url for the given relative url", () => {
            expect(Util.apiUrl("/suburl")).toEqual(`${CONST.API_URL}/suburl`);
        });
    });

    describe("transformResponse", () => {
        const responseString =
            "{ " +
            '"id": "map", ' +
            '"another_key": "another_value", ' +
            '"url": "http://ushahidi-backend/api/v3/config/map", ' +
            '"allowed_methods": [ ' +
            '"get", ' +
            '"post", ' +
            '"put", ' +
            '"delete" ' +
            "] " +
            "}";

        it(
            'returns the response string as a parsed hash without "url" and ' +
                '"allowed_methods" keys',
            () => {
                expect(Util.transformResponse(responseString)).toEqual({
                    id: "map",
                    another_key: "another_value",
                    url: "http://ushahidi-backend/api/v3/config/map"
                });
            }
        );
    });
});
/* eslint-enable */
