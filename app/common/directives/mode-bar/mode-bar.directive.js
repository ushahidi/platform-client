const modeBar = require("./mode-bar.html");
const supportLinks = require("./support-links.html");

module.exports = [
    "Features",
    "Authentication",
    "Registration",
    "ModalService",
    "$rootScope",
    "ConfigEndpoint",
    "CollectionsService",
    "$window",
    "$transitions",
    function(
        Features,
        Authentication,
        Registration,
        ModalService,
        $rootScope,
        ConfigEndpoint,
        CollectionsService,
        $window,
        $transitions
    ) {
        return {
            restrict: "E",
            replace: true,
            scope: {
                currentUser: "="
            },
            template: modeBar,
            link($scope) {
                $scope.moreActive = false;
                $scope.isActivityAvailable = false;
                $scope.canRegister = false;
                $scope.hasManageSettingsPermission =
                    $rootScope.hasManageSettingsPermission;
                $scope.showMore = () => {
                    $scope.moreActive = !$scope.moreActive;
                };
                $scope.viewCollectionListing =
                    CollectionsService.showCollectionList;
                $scope.viewAccountSettings = () => {
                    ModalService.openTemplate(
                        "<account-settings></account-settings>",
                        "",
                        false,
                        false,
                        true,
                        true
                    );
                };
                $scope.viewSupportLinks = () => {
                    const scope = {
                        intercomAppId: $scope.intercomAppId,
                        loggedin: Authentication.getLoginStatus()
                    };
                    ModalService.openTemplate(
                        supportLinks,
                        "",
                        false,
                        scope,
                        true,
                        true
                    );
                };
                $scope.login = Authentication.openLogin;
                $scope.logout = Authentication.logout;
                $scope.register = Registration.openRegister;
                $scope.intercomAppId = $window.ushahidi.intercomAppId;

                function handleRouteChange() {
                    $scope.moreActive = false;
                    // $scope.showNewNavbar = !$state.$current.includes['settings.usersList'];
                }

                function activate() {
                    $scope.$on("$locationChangeStart", handleRouteChange);

                    $transitions.onEnter({}, transition => {
                        const stateObject = transition.targetState().$state();
                        if (stateObject.includes["settings.react"]) {
                            $scope.showNewNavbar = true;
                        } else {
                            $scope.showNewNavbar = false;
                        }
                    });

                    Features.loadFeatures().then(() => {
                        $scope.isActivityAvailable = Features.isViewEnabled(
                            "activity"
                        );
                    });

                    ConfigEndpoint.get({ id: "site" }, site => {
                        $scope.canRegister = !site.private;
                    });
                }
                activate();
            }
        };
    }
];
