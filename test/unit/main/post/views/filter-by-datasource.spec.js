describe('filter by datasource directive', function () {
    var $scope,
        $rootScope,
        isolateScope,
        element,
        ConfigEndpoint,
        isAdmin,
        $location;

    beforeEach(function () {
        var testApp;
        fixture.setBase('mocked_backend/api/v3');
        testApp = makeTestApp();
        testApp.directive('filterByDatasource', require('app/main/posts/views/filter-by-datasource.directive.js'));
        angular.mock.module('testApp');
    });

    beforeEach(inject(function (_$rootScope_, $compile, _ConfigEndpoint_, _, _$location_) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        $location = _$location_;
        ConfigEndpoint = _ConfigEndpoint_;
        spyOn(ConfigEndpoint, 'get').and.callThrough();

        $scope.filters = {
            source: ['sms', 'twitter', 'web', 'email'],
            form: [1, 2]
        };
        $scope.postStats = [
                {total: 1, type: 'email'},
                {total: 2, type: 'sms'}
            ];

        isAdmin = true;
        $rootScope.isAdmin = function () {
            return isAdmin;
        };
        element = '<filter-by-datasource filters="filters" post-stats="postStats"></filter-by-datasource>';
        element = $compile(element)($scope);
        $scope.$digest();
        isolateScope = element.isolateScope();
    }));
    describe('test directive-functions', function () {
        it('should fetch providers from endpoint', function () {
            expect(ConfigEndpoint.get).toHaveBeenCalledWith({id: 'data-provider'});
        });
        it('should calculate only display stats for each provider that are available', function () {
            // not logged in, only providers with available messages should be displayed
            isolateScope.dataSources = null;
            isolateScope.assignStatsToProviders();
            var assignedProviders =  [
                {label: 'Email', heading: 'Emails', total: 1},
                {label: 'SMS', heading: 'SMS', total: 2}];
            expect(isolateScope.providers).toEqual(assignedProviders);
            // logged in with post-manage rights, also available providers that have no messages should be visible
            isolateScope.dataSources = {email: true, frontlinesms: true, twilio: false, nexmo: false, twitter: true};
            isolateScope.assignStatsToProviders();
            assignedProviders.push({
                label: 'Twitter', heading: 'Tweets', total: 0});
            expect(isolateScope.providers).toEqual(assignedProviders);
        });
        it('get totals for a source', function () {
            expect(isolateScope.getTotals('sms')).toEqual(2);
            expect(isolateScope.getTotals('email')).toEqual(1);
            expect(isolateScope.getTotals('twitter')).toEqual(0);
        });
        it('should return correct string for heading', function () {
            expect(isolateScope.formatHeading('Twitter')).toEqual('Tweets');
            expect(isolateScope.formatHeading('SMS')).toEqual('SMS');
            expect(isolateScope.formatHeading('Email')).toEqual('Emails');
            expect(isolateScope.formatHeading('NonExistingDatasource')).toEqual(' ');
        });
        it('should change the filters to show only posts from the selected provider', function () {
            isolateScope.showOnly('Email');
            expect(isolateScope.filters.form).toContain('none');
            expect(isolateScope.filters.source).toEqual(['email']);
        });
        it('should change the filters to hide all posts with the selected provider', function () {
            $scope.filters.source = ['email'];
            isolateScope.hide('Email');
            expect(isolateScope.filters.source).not.toContain('email');
        });
        it('should change the filters to only show posts without a form', function () {
            isolateScope.showOnlyIncoming('Email');
            expect(isolateScope.filters.source).toEqual(['email']);
            expect(isolateScope.filters.form).toEqual(['none']);
        });
        it('should redirect to data-view if choosing posts-without a form', function () {
            $location.path('/views/map');
            isolateScope.showOnlyIncoming('SMS');
            expect($location.path()).toEqual('/views/data');
        });
        it('should toggle the filters based on if selected filter is activated or not', function () {
            expect(isolateScope.filters.source).toEqual(['sms', 'twitter', 'web', 'email']);
            var filter = isolateScope.filters.source[Math.floor(Math.random() * isolateScope.filters.source.length)];
            isolateScope.toggleFilters(filter);
            expect(isolateScope.filters.source).not.toContain(filter);
        });
    });
});
