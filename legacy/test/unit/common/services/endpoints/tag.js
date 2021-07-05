require('angular-resource');
require('angular-cache');

describe('TagEndpoint', function () {

    var $rootScope,
        $httpBackend,
        BACKEND_URL,
        TagEndpoint;


    beforeEach(function () {
        var testApp = makeTestApp();

        testApp.requires.push('ngResource', 'angular-cache');
        testApp
        .service('TagEndpoint', require('app/common/services/endpoints/tag.js'))
        .config(require('app/common/configs/cache-config.js'));



        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.inject(function (_$httpBackend_, _$rootScope_, _CONST_, _TagEndpoint_) {
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
        BACKEND_URL = _CONST_.BACKEND_URL;
        TagEndpoint = _TagEndpoint_;
    }));

    describe('"tags/:id" for data of all tags', function () {
        describe('get all tags', function () {

            var mockTagDataResponse;

            beforeEach(function () {
                mockTagDataResponse =
                {
                    'count': 2,
                    'results': [
                        {
                            'id': 1,
                            'url': 'http://192.168.33.110/api/v3/tags/1',
                            'parent_id': null,
                            'tag': 'Test tag',
                            'slug': 'test-tag',
                            'type': 'category',
                            'color': null,
                            'icon': 'tag',
                            'description': null,
                            'priority': 0,
                            'created': '1970-01-01T00:00:00+00:00',
                            'role': null,
                            'allowed_privileges': [
                                'read',
                                'create',
                                'update',
                                'delete',
                                'search'
                            ]
                        },
                        {
                            'id': 2,
                            'url': 'http://192.168.33.110/api/v3/tags/2',
                            'parent_id': null,
                            'tag': 'Duplicate',
                            'slug': 'duplicate',
                            'type': 'category',
                            'color': null,
                            'icon': 'tag',
                            'description': null,
                            'priority': 0,
                            'created': '1970-01-01T00:00:00+00:00',
                            'role': null,
                            'allowed_privileges': [
                                'read',
                                'create',
                                'update',
                                'delete',
                                'search'
                            ]
                        }
                    ],
                    'limit': null,
                    'offset': 0,
                    'order': 'asc',
                    'orderby': 'id',
                    'curr': 'http://192.168.33.110/api/v3/tags?orderby=id&order=asc&offset=0',
                    'next': 'http://192.168.33.110/api/v3/tags?orderby=id&order=asc&offset=0',
                    'prev': 'http://192.168.33.110/api/v3/tags?orderby=id&order=asc&offset=0',
                    'total_count': 2
                };
            });

            it('should call the correct url and parse and return the correct data', function () {
                var successCallback = jasmine.createSpy('success');
                $httpBackend.expectGET(BACKEND_URL + '/api/v2/tags').respond(mockTagDataResponse);

                TagEndpoint.queryFresh().$promise.then(successCallback);

                $httpBackend.flush();
                $rootScope.$digest();

                expect(successCallback).toHaveBeenCalled();

                var actualTagData = successCallback.calls.mostRecent().args[0];
                expect(actualTagData.length).toEqual(mockTagDataResponse.results.length);
                expect(actualTagData[0].tag).toEqual(mockTagDataResponse.results[0].tag);
            });

            it('using queryFresh should call the correct url and return the correct data', function () {
                var successCallback = jasmine.createSpy('success');

                spyOn(TagEndpoint, 'query').and.callThrough();

                TagEndpoint.queryFresh().$promise.then(successCallback);

                expect(TagEndpoint.query).toHaveBeenCalled();
            });

        });
    });

    describe('get data for "tags/1"', function () {

        var mockTagDataResponse;

        beforeEach(function () {
            mockTagDataResponse = {
                'id': 1,
                'url': 'http://192.168.33.110/api/v3/tags/1',
                'parent_id': null,
                'tag': 'Test tag',
                'slug': 'test-tag',
                'type': 'category',
                'color': null,
                'icon': 'tag',
                'description': null,
                'priority': 0,
                'created': '1970-01-01T00:00:00+00:00',
                'role': null,
                'allowed_privileges': [
                    'read',
                    'create',
                    'update',
                    'delete',
                    'search'
                ]
            };
        });

        describe('get tag data', function () {
            it('should call the correct url and return the correct data', function () {
                var successCallback = jasmine.createSpy('success');
                $httpBackend.expectGET(BACKEND_URL + '/api/v2/tags/1').respond(mockTagDataResponse);

                TagEndpoint.get({id: 1}).$promise.then(successCallback);

                $httpBackend.flush();
                $rootScope.$digest();

                expect(successCallback).toHaveBeenCalled();

                var actualTagData = successCallback.calls.mostRecent().args[0];
                expect(actualTagData.id).toEqual(mockTagDataResponse.id);
                expect(actualTagData.tag).toEqual(mockTagDataResponse.tag);
                expect(actualTagData.icon).toEqual(mockTagDataResponse.icon);
            });

            it('using getFresh should call the correct url and return the correct data', function () {
                var successCallback = jasmine.createSpy('success');

                spyOn(TagEndpoint, 'get').and.callThrough();

                TagEndpoint.getFresh({id: 1}).$promise.then(successCallback);
                expect(TagEndpoint.get).toHaveBeenCalled();
            });

        });

        describe('update tag data', function () {

            beforeEach(function () {
                mockTagDataResponse = {
                    'id': 1,
                    'url': 'http://192.168.33.110/api/v3/tags/1',
                    'parent_id': null,
                    'tag': 'Test tag',
                    'slug': 'test-tag',
                    'type': 'category',
                    'color': null,
                    'icon': 'tag',
                    'description': 'Test',
                    'priority': 0,
                    'created': '1970-01-01T00:00:00+00:00',
                    'role': null,
                    'allowed_privileges': [
                        'read',
                        'create',
                        'update',
                        'delete',
                        'search'
                    ]
                };
            });

            it('should call the correct url and return the updated tag data', function () {
                var successCallback = jasmine.createSpy('success');
                $httpBackend.expectPUT(BACKEND_URL + '/api/v2/tags/1').respond(mockTagDataResponse);

                var tagDataToUpdate = {
                    'id': 1,
                    'tag': 'Test tag',
                    'description': 'Test'
                };

                TagEndpoint.update(tagDataToUpdate).$promise.then(successCallback);

                $httpBackend.flush();
                $rootScope.$digest();

                expect(successCallback).toHaveBeenCalled();

                var actualTagData = successCallback.calls.mostRecent().args[0];
                expect(actualTagData.id).toEqual(mockTagDataResponse.id);
                expect(actualTagData.tag).toEqual(tagDataToUpdate.tag);
                expect(actualTagData.description).toEqual(tagDataToUpdate.description);
            });

            it('using saveCache should call the correct url and return the correct data', function () {
                var successCallback = jasmine.createSpy('success');

                spyOn(TagEndpoint, 'update').and.callThrough();

                TagEndpoint.saveCache({id: 1}).$promise.then(successCallback);
                expect(TagEndpoint.update).toHaveBeenCalled();
            });

            it('should return an id when deleting an entity', function () {
                var successCallback = jasmine.createSpy('success');
                $httpBackend.expectDELETE(BACKEND_URL + '/api/v2/tags/1').respond(mockTagDataResponse);

                TagEndpoint.deleteEntity({id: 1}).$promise.then(successCallback);

                $httpBackend.flush();
                $rootScope.$digest();

                expect(successCallback).toHaveBeenCalled();

                var actualTagData = successCallback.calls.mostRecent().args[0];
                expect(actualTagData.id).toEqual(mockTagDataResponse.id);
            });

            it('using delete should call the correct url and return the correct data', function () {
                var successCallback = jasmine.createSpy('success');

                spyOn(TagEndpoint, 'deleteEntity').and.callThrough();

                TagEndpoint.delete({id: 1}).$promise.then(successCallback);
                expect(TagEndpoint.deleteEntity).toHaveBeenCalled();
            });
        });
    });
});
