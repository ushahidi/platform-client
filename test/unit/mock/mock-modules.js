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

.service('FormEndpoint', require('./services/form.js'))
.service('FormStageEndpoint', require('./services/form-stages.js'))
.service('TagEndpoint', require('./services/tag.js'))
.service('ConfigEndpoint', require('./services/config.js'))
.service('DataProviderEndpoint', require('./services/data-provider.js'))

.service('Authentication', require('./services/authentication.js'))
.service('Session', require('./services/session.js'))
.service('Notify', require('./services/notify.js'));
