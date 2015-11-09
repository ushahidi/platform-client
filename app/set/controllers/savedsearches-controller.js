module.exports = [
    '$scope',
    '$translate',
    '$routeParams',
    '_',
    'GlobalFilter',
    'savedSearch',
    'NotificationEndpoint',
    'Notify',
    function (
        $scope,
        $translate,
        $routeParams,
        _,
        GlobalFilter,
        savedSearch,
        NotificationEndpoint,
        Notify
    ) {
        // Set view based on route or set view
        $scope.currentView = function () {
            return $routeParams.view || savedSearch.view;
        };

        // Add set to the scope
        $scope.savedSearch = savedSearch;

        $translate('post.posts').then(function (title) {
            $scope.title = title;
            $scope.$emit('setPageTitle', title);
        });

        $scope.savedSearchOpen = {};
        $scope.savedSearchOpen.data = false;
        $scope.setSavedSearchOpen = function () {
            $scope.savedSearchOpen.data = !$scope.savedSearchOpen.data;
        };

        // Check if we can edit
        $scope.canEdit = function () {
            return _.contains(savedSearch.allowed_privileges, 'update');
        };

        // whenever the GlobalFilter post query changes,
        // update the current list of posts
        $scope.$watch(function () {
            return JSON.stringify(GlobalFilter.getPostQuery());
        }, function (newValue, oldValue) {
            $scope.filters = GlobalFilter.getPostQuery();
        });

        // Set initial filter state
        GlobalFilter.setSelected(savedSearch.filter);
        // Slight hack: to avoid incorrectly detecting a changed search
        // we push the real query we're using back into the saved search.
        // This will now include any default params we excluded before
        savedSearch.filter = GlobalFilter.getPostQuery();

        // Show Add Notification link
        $scope.showNotificationLink = false;

        NotificationEndpoint.get({set: savedSearch.id, ignore403: true}, function (notifications) {
            // show link if subscription does not exist
            $scope.showNotificationLink = notifications.length === 0;
        });

        $scope.saveNotification = function (savedSearch) {
            var notification = {set: savedSearch.id};

            NotificationEndpoint.save(notification, function (notification) {
                // No need to show the link after subscription
                $scope.showNotificationLink = false;
                $translate('notify.notification.add', {set: savedSearch.name})
                    .then(function (message) {
                        Notify.showSingleAlert(message);
                    });
            });
        };
    }
];
