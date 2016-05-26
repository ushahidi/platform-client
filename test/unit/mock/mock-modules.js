angular.module('ushahidi.mock', [])
.provider('$translate', function () {
    var store                 = {};
    this.get                  = function () {
        return false;
    };
    this.preferredLanguage    = function () {
        return false;
    };
    this.storage              = function () {
        return false;
    };
    this.translations         = function () {
        return {};
    };

    this.$get = ['$q', function ($q) {
        var $translate = function (key) {
            return ({
                then: function (successCallback) {
                    successCallback();
                }
            });
        };

        $translate.addPair    = function (key, val) {
            store[key] = val;
        };
        $translate.instant = function () {
            return false;
        };
        $translate.isPostCompilingEnabled = function () {
            return false;
        };
        $translate.preferredLanguage = function () {
            return false;
        };
        $translate.statefulFilter = function () {
            return false;
        };
        $translate.storage    = function () {
            return false;
        };
        $translate.storageKey = function () {
            return true;
        };
        $translate.use        = function () {
            return false;
        };

        return $translate;
    }];
})
.service('leafletData', require('./services/third_party/leaflet.js'))
.service('d3', require('./services/third_party/d3.js'))

.service('PostEndpoint', require('./services/post.js'))
.service('FormEndpoint', require('./services/form.js'))
.service('FormStageEndpoint', require('./services/form-stages.js'))
.service('FormAttributeEndpoint', require('./services/form-attributes.js'))
.service('TagEndpoint', require('./services/tag.js'))
.service('NotificationEndpoint', require('./services/notification.js'))
.service('MessageEndpoint', require('./services/message.js'))
.service('SavedSearchEndpoint', require('./services/savedsearch.js'))
.service('UserEndpoint', require('./services/user.js'))
.service('CollectionEndpoint', require('./services/collection.js'))
.service('ContactEndpoint', require('./services/contact.js'))
.service('ConfigEndpoint', require('./services/config.js'))
.service('RoleEndpoint', require('./services/role.js'))
.service('PermissionEndpoint', require('./services/permission.js'))
.service('DataProviderEndpoint', require('./services/data-provider.js'))
.service('DataImportEndpoint', require('./services/data-import.js'))
.service('DataRetriever', require('./services/data-retriever.js'))
.service('MediaEndpoint', require('./services/media.js'))

.service('Features', require('./services/features.js'))
.service('Authentication', require('./services/authentication.js'))
.service('Session', require('./services/session.js'))
.service('GlobalFilter', require('./services/global-filters.js'))
.service('PostFilters', require('./services/post-filters.js'))
.service('Maps', require('./services/maps.js'))
.service('PostEditService', require('./services/post-edit-service.js'))
.service('Notify', require('./services/notify.js'));
