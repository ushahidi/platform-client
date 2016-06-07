module.exports = [function () {
    return function (date) {
        return {
            startOf: function () {
                return this;
            },
            toDate: function () {
                return this;
            }
        };
    };
}];
