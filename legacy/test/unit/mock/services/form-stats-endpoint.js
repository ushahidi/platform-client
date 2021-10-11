module.exports = [function () {
    return {
        query: function () {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    successCallback({
                            total_responses: 9,
                            total_recipients: 5
                        });
                }
            }};
        }
    };
}];
