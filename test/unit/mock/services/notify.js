module.exports = [function () {
    return {
       showNotificationSlider: function (message){
            console.log('test');
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
