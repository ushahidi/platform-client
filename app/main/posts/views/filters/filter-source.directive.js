module.exports = SourceSelectDirective;

SourceSelectDirective.$inject = ['$rootScope', 'ConfigEndpoint', '_'];
function SourceSelectDirective($rootScope, ConfigEndpoint, _) {
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        require: 'ngModel',
        link: SourceSelectLink,
        template: require('./filter-source.html')
    };

    function SourceSelectLink(scope, element, attrs, ngModel) {
        scope.selectedSources = [];
        scope.availableSources = [];
        scope.hasPermission = $rootScope.hasPermission;

        activate();

        function activate() {
            // getting enabled providers if user has permissions
            if (scope.hasPermission()) {
                ConfigEndpoint.get({ id: 'data-provider' }).$promise.then(function (results) {
                    var smsProviders = ['smssync', 'twilio', 'frontlinesms'];
                    scope.availableSources = _.map(results.providers, function (source, key) {
                        if (source) {
                            if (_.contains(smsProviders, key)) {
                                return 'SMS';
                            } else {
                                return key.substr(0, 1).toUpperCase() + key.substr(1);
                            }
                        }
                    });

                    scope.availableSources = _.chain(scope.availableSources)
                        .compact()
                        .uniq()
                        .value();
                });
            }
            scope.$watch('selectedSources', saveValueToView, true);
            ngModel.$render = renderModelValue;
        }

        function renderModelValue() {
            // Update selectedSources w/o breaking references used by checklist-model
            Array.prototype.splice.apply(scope.selectedSources, [0, scope.selectedSources.length].concat(ngModel.$viewValue));
        }

        function saveValueToView(selectedSources) {
            ngModel.$setViewValue(angular.copy(selectedSources));
        }
    }
}
