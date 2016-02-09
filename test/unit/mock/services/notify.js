module.exports = [function () {
    return {
        showConfirm: function (message){
            return {
                then: function (successCallback) {
                    successCallback();
                }
            }
        }
    };
}];
