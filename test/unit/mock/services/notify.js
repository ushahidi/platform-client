module.exports = [function () {
    return {
       showNotificationSlider: function (message){
            return {
                then: function (successCallback) {
                    successCallback();
                }
            }
        },
        showApiErrors: function (message){
            return {
                then: function (successCallback) {
                    successCallback();
                }
            }
        },
        showConfirm: function (message){
            return {
                then: function (successCallback) {
                    successCallback();
                }
            }
        }
    };
}];
