module.exports = function () {
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
            var dfd = $q.defer();
            dfd.resolve(key);
            return dfd.promise;
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
};
