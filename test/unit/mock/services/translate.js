module.exports = [function () {
    return {
        $get: function () {},
        then: function (successCallback) {
            successCallback();
        }
    };
}];
