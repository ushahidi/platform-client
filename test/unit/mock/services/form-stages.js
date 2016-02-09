module.exports = [function () {
    return {
        query: function () {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    successCallback([{
                        name: 'test form stages',
                        id: 1
                    }]);
                }
            }};
        },
        getFresh: function () {
            return {
                name: 'test form stages',
                id: 1
            };
        },
        delete: function () {
            return {$promise: {
                then: function (successCallback) {
                    successCallback();
                }
            }};
        },
        saveCache: function (stage) {
          console.log(stage);
            return {$promise: {
                then: function (successCallback, failCallback) {
                  stage.formId === 1 ? successCallback({id:1}) : failCallback('error');
                }
            }};
        }
    };
}];
