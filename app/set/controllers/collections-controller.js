module.exports = [
    '$scope',
    '$translate',
    '$routeParams',
    '_',
    'GlobalFilter',
    'collection',
    'NotificationEndpoint',
    'Notify',
    function (
        $scope,
        $translate,
        $routeParams,
        _,
        GlobalFilter,
        collection,
        NotificationEndpoint,
        Notify
    ) {
        // Set view based on route or set view
        $scope.currentView = function () {
            return $routeParams.view || collection.view;
        };

        // Add set to the scope
        $scope.collection = collection;

        // Set the page title
        $translate('post.posts').then(function (title) {
            $scope.title = title;
            $scope.$emit('setPageTitle', title);
        });

        // Check if we can edit
        $scope.canEdit = function () {
            return _.contains(collection.allowed_privileges, 'update');
        };

        // @todo: Integrate the modal state controller into a globally accessible
        // directive which binds the same logic but does not effect markup
        // This is related to the same functionality in the common controller
        // navigation.js
        $scope.isOpen = {};
        $scope.isOpen.data = false;
        $scope.setIsOpen = function () {
            $scope.isOpen.data = !$scope.isOpen.data;
        };

        // Extend filters, always adding the current collection id
        var extendFilters = function (filters) {
            filters = _.extend({ set : [] }, filters);
            filters.set.push(collection.id);
            return filters;
        };

        // whenever the GlobalFilter post query changes,
        // update the current list of posts
        $scope.$watch(function () {
            return JSON.stringify(GlobalFilter.getPostQuery());
        }, function (newValue, oldValue) {
            $scope.filters = extendFilters(GlobalFilter.getPostQuery());
        });

        // Reset GlobalFilter + add set filter
        GlobalFilter.clearSelected();
        $scope.filters = extendFilters({});

        // Show Add Notification link
        $scope.showNotificationLink = false;

        NotificationEndpoint.get({set: collection.id, ignore403: true}, function (notifications) {
            // show link if subscription does not exist
            $scope.showNotificationLink = notifications.length === 0;
        });

        $scope.saveNotification = function (collection) {
            var notification = {set: collection.id};

            NotificationEndpoint.save(notification, function (notification) {
                // No need to show the link after subscription
                $scope.showNotificationLink = false;
                $translate('notify.notification.add', {set: collection.name})
                    .then(function (message) {
                        Notify.showSingleAlert(message);
                    });
            });
        };
    }
];
