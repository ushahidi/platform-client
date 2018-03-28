module.exports = [function () {
    return {
        query: function () {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    successCallback({'results': [{
                            id: 1,
                            country_name: 'testCountry',
                            dial_code: '+100',
                            country_code: 'TC'
                        }]});
                }
            }};
        }
    };
}];
