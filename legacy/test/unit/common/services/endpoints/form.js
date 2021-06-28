require('angular-resource');
require('angular-cache');


describe('FormEndpoint', function () {

    var $rootScope,
        $httpBackend,
        BACKEND_URL,
        FormEndpoint;


    beforeEach(function () {
        var testApp = makeTestApp();

        testApp.requires.push('ngResource', 'angular-cache');
        testApp
        .service('FormEndpoint', require('app/common/services/endpoints/form.js'))
        .config(require('app/common/configs/cache-config.js'));



        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.inject(function (_$httpBackend_, _$rootScope_, _CONST_, _FormEndpoint_) {
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
        BACKEND_URL = _CONST_.BACKEND_URL;
        FormEndpoint = _FormEndpoint_;
    }));

    describe('"forms/:id" for data of all forms', function () {
        describe('get all forms', function () {

            var mockFormDataResponse;

            beforeEach(function () {
                mockFormDataResponse =
                {
                    'count': 2,
                    'results': [
                        {
                            'id': 1,
                            'url': 'http://192.168.33.110/api/v3/forms/1',
                            'parent_id': null,
                            'form': 'Test form',
                            'slug': 'test-form',
                            'type': 'category',
                            'color': null,
                            'icon': 'form',
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
                            'url': 'http://192.168.33.110/api/v3/forms/2',
                            'parent_id': null,
                            'form': 'Duplicate',
                            'slug': 'duplicate',
                            'type': 'category',
                            'color': null,
                            'icon': 'form',
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
                    'curr': 'http://192.168.33.110/api/v3/forms?orderby=id&order=asc&offset=0',
                    'next': 'http://192.168.33.110/api/v3/forms?orderby=id&order=asc&offset=0',
                    'prev': 'http://192.168.33.110/api/v3/forms?orderby=id&order=asc&offset=0',
                    'total_count': 2
                };
            });

            it('should call the correct url and parse and return the correct data', function () {
                var successCallback = jasmine.createSpy('success');
                $httpBackend.expectGET(BACKEND_URL + '/api/v2/forms').respond(mockFormDataResponse);

                FormEndpoint.queryFresh().$promise.then(successCallback);

                $httpBackend.flush();
                $rootScope.$digest();

                expect(successCallback).toHaveBeenCalled();

                var actualFormData = successCallback.calls.mostRecent().args[0];
                expect(actualFormData.length).toEqual(mockFormDataResponse.results.length);
                expect(actualFormData[0].form).toEqual(mockFormDataResponse.results[0].form);
            });

            it('using queryFresh should call the correct url and return the correct data', function () {
                var successCallback = jasmine.createSpy('success');

                spyOn(FormEndpoint, 'query').and.callThrough();

                FormEndpoint.queryFresh().$promise.then(successCallback);

                expect(FormEndpoint.query).toHaveBeenCalled();
            });

        });
    });

    describe('get data for "forms/1"', function () {

        var mockFormDataResponse;

        beforeEach(function () {
            mockFormDataResponse = {
                'id': 1,
                'url': 'http://192.168.33.110/api/v3/forms/1',
                'parent_id': null,
                'form': 'Test form',
                'slug': 'test-form',
                'type': 'category',
                'color': null,
                'icon': 'form',
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

        describe('get form data', function () {
            it('should call the correct url and return the correct data', function () {
                var successCallback = jasmine.createSpy('success');
                $httpBackend.expectGET(BACKEND_URL + '/api/v2/forms/1').respond(mockFormDataResponse);

                FormEndpoint.get({id: 1}).$promise.then(successCallback);

                $httpBackend.flush();
                $rootScope.$digest();

                expect(successCallback).toHaveBeenCalled();

                var actualFormData = successCallback.calls.mostRecent().args[0];
                expect(actualFormData.id).toEqual(mockFormDataResponse.id);
                expect(actualFormData.form).toEqual(mockFormDataResponse.form);
                expect(actualFormData.icon).toEqual(mockFormDataResponse.icon);
            });

            it('using getFresh should call the correct url and return the correct data', function () {
                var successCallback = jasmine.createSpy('success');

                spyOn(FormEndpoint, 'get').and.callThrough();

                FormEndpoint.getFresh({id: 1}).$promise.then(successCallback);
                expect(FormEndpoint.get).toHaveBeenCalled();
            });

        });

        describe('update form data', function () {

            beforeEach(function () {
                mockFormDataResponse = {
                    'id': 1,
                    'url': 'http://192.168.33.110/api/v3/forms/1',
                    'parent_id': null,
                    'form': 'Test form',
                    'slug': 'test-form',
                    'type': 'category',
                    'color': null,
                    'icon': 'form',
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

            it('should call the correct url and return the updated form data', function () {
                var successCallback = jasmine.createSpy('success');
                $httpBackend.expectPUT(BACKEND_URL + '/api/v2/forms/1').respond(mockFormDataResponse);

                var formDataToUpdate = {
                    'id': 1,
                    'form': 'Test form',
                    'description': 'Test'
                };

                FormEndpoint.update(formDataToUpdate).$promise.then(successCallback);

                $httpBackend.flush();
                $rootScope.$digest();

                expect(successCallback).toHaveBeenCalled();

                var actualFormData = successCallback.calls.mostRecent().args[0];
                expect(actualFormData.id).toEqual(mockFormDataResponse.id);
                expect(actualFormData.form).toEqual(formDataToUpdate.form);
                expect(actualFormData.description).toEqual(formDataToUpdate.description);
            });

            it('using saveCache should call the correct url and return the correct data', function () {
                var successCallback = jasmine.createSpy('success');

                spyOn(FormEndpoint, 'update').and.callThrough();

                FormEndpoint.saveCache({id: 1}).$promise.then(successCallback);
                expect(FormEndpoint.update).toHaveBeenCalled();
            });

            it('should return an id when deleting an entity', function () {
                var successCallback = jasmine.createSpy('success');
                $httpBackend.expectDELETE(BACKEND_URL + '/api/v2/forms/1').respond(mockFormDataResponse);

                FormEndpoint.deleteEntity({id: 1}).$promise.then(successCallback);

                $httpBackend.flush();
                $rootScope.$digest();

                expect(successCallback).toHaveBeenCalled();

                var actualFormData = successCallback.calls.mostRecent().args[0];
                expect(actualFormData.id).toEqual(mockFormDataResponse.id);
            });

            it('using delete should call the correct url and return the correct data', function () {
                var successCallback = jasmine.createSpy('success');

                spyOn(FormEndpoint, 'deleteEntity').and.callThrough();

                FormEndpoint.delete({id: 1}).$promise.then(successCallback);
                expect(FormEndpoint.deleteEntity).toHaveBeenCalled();
            });
        });
    });
});
