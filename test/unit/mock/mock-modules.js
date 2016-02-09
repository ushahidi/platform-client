angular.module('ushahidi.mock', [])
.factory('$translate', function translateFactory () {
    return ($translate);        
    function $translate (text){ 
        return ({
            then: function (successCallback) {
                successCallback();
            }
        });
    }
})
.service('TagEndpoint', require('./services/tag.js'))
.service('Notify', require('./services/notify.js'));
