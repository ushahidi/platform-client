require('angular-resource');
require('angular-cache');


describe('FormAttributeEndpoint', function () {

    var $rootScope,
        $httpBackend,
        BACKEND_URL,
        FormAttributeEndpoint;


    beforeEach(function () {
        var testApp = makeTestApp();

        testApp.requires.push('ngResource', 'angular-cache');
        testApp
        .service('FormAttributeEndpoint', require('app/common/services/endpoints/form-attributes.js'))
        .config(require('app/common/configs/cache-config.js'));



        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.inject(function (_$httpBackend_, _$rootScope_, _CONST_, _FormAttributeEndpoint_) {
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
        BACKEND_URL = _CONST_.BACKEND_URL;
        FormAttributeEndpoint = _FormAttributeEndpoint_;
    }));

    describe('"form-attributes/:id" for data of all form-attributes', function () {
        describe('get all form-attributes', function () {

            var mockFormAttributeDataResponse;

            beforeEach(function () {
                mockFormAttributeDataResponse =
                {
                    'count': 2,
                    'results': [
                        {
                            'id': 1,
                            'url': 'http://192.168.33.110/api/v3/form_attributes/1',
                            'key': 'test_varchar',
                            'label': 'Test varchar',
                            'instructions': null,
                            'input': 'text',
                            'type': 'varchar',
                            'required': false,
                            'default': null,
                            'priority': 1,
                            'options': [

                            ],
                            'cardinality': 1,
                            'config': null,
                            'form_stage_id': 1,
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
                            'url': 'http://192.168.33.110/api/v3/form_attributes/2',
                            'key': 'test_point',
                            'label': 'Test point',
                            'instructions': null,
                            'input': 'location',
                            'type': 'point',
                            'required': false,
                            'default': null,
                            'priority': 1,
                            'options': [

                            ],
                            'cardinality': 1,
                            'config': null,
                            'form_stage_id': 1,
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
                    'curr': 'http://192.168.33.110/api/v3/form/1/attributes?orderby=id&order=asc&offset=0',
                    'next': 'http://192.168.33.110/api/v3/form/1/attributes?orderby=id&order=asc&offset=0',
                    'prev': 'http://192.168.33.110/api/v3/form/1/attributes?orderby=id&order=asc&offset=0',
                    'total_count': 2
                };
            });

            it('should call the correct url and parse and return the correct data', function () {
                var successCallback = jasmine.createSpy('success');
                $httpBackend.expectGET(BACKEND_URL + '/api/v2/forms/1/attributes?order=asc&orderby=priority').respond(mockFormAttributeDataResponse);

                FormAttributeEndpoint.query({formId: 1}).$promise.then(successCallback);

                $httpBackend.flush();
                $rootScope.$digest();

                expect(successCallback).toHaveBeenCalled();

                var actualFormAttributeData = successCallback.calls.mostRecent().args[0];
                expect(actualFormAttributeData.length).toEqual(mockFormAttributeDataResponse.results.length);
                expect(actualFormAttributeData[0].key).toEqual(mockFormAttributeDataResponse.results[0].key);
            });
        });
    });

    describe('get data for "form-attributes/1"', function () {

        var mockFormAttributeDataResponse;

        beforeEach(function () {
            mockFormAttributeDataResponse = {
                'id': 1,
                'url': 'http://192.168.33.110/api/v3/form_attributes/1',
                'key': 'test_varchar',
                'label': 'Test varchar',
                'instructions': null,
                'input': 'text',
                'type': 'varchar',
                'required': false,
                'default': null,
                'priority': 1,
                'options': [

                ],
                'cardinality': 1,
                'config': null,
                'form_stage_id': 1,
                'allowed_privileges': [
                    'read',
                    'create',
                    'update',
                    'delete',
                    'search'
                ]
            };
        });

        describe('get form-attributes data', function () {
            it('should call the correct url and return the correct data', function () {
                var successCallback = jasmine.createSpy('success');
                $httpBackend.expectGET(BACKEND_URL + '/api/v2/forms/1/attributes/1?order=asc&orderby=priority').respond(mockFormAttributeDataResponse);
                FormAttributeEndpoint.get({id: 1, formId: 1}).$promise.then(successCallback);

                $httpBackend.flush();
                $rootScope.$digest();

                expect(successCallback).toHaveBeenCalled();

                var actualFormAttributeData = successCallback.calls.mostRecent().args[0];
                expect(actualFormAttributeData.id).toEqual(mockFormAttributeDataResponse.id);
                expect(actualFormAttributeData.key).toEqual(mockFormAttributeDataResponse.key);
                expect(actualFormAttributeData.label).toEqual(mockFormAttributeDataResponse.label);
            });

            it('using get should call the correct url and return the correct data', function () {
                var successCallback = jasmine.createSpy('success');

                spyOn(FormAttributeEndpoint, 'get').and.callThrough();

                FormAttributeEndpoint.get({id: 1, formId: 1}).$promise.then(successCallback);
                expect(FormAttributeEndpoint.get).toHaveBeenCalled();
            });

        });

        describe('update form-attributes data', function () {
            beforeEach(function () {
                mockFormAttributeDataResponse = {
                    'id': 1,
                    'url': 'http://192.168.33.110/api/v3/form_attributes/1',
                    'key': 'test_varchar',
                    'label': 'Test varchar',
                    'instructions': null,
                    'input': 'text',
                    'type': 'varchar',
                    'required': false,
                    'default': null,
                    'priority': 1,
                    'options': [

                    ],
                    'cardinality': 1,
                    'config': null,
                    'form_stage_id': 1,
                    'allowed_privileges': [
                        'read',
                        'create',
                        'update',
                        'delete',
                        'search'
                    ]
                };
            });

            it('should call the correct url and return the updated form-attributes data', function () {
                var successCallback = jasmine.createSpy('success');
                $httpBackend.expectPUT(BACKEND_URL + '/api/v2/forms/1/attributes/1?order=asc&orderby=priority').respond(mockFormAttributeDataResponse);

                var formattributesDataToUpdate = {
                    'id': 1,
                    'formId': 1,
                    'key': 'test_varchar',
                    'label': 'Test varchar'
                };

                FormAttributeEndpoint.update(formattributesDataToUpdate).$promise.then(successCallback);

                $httpBackend.flush();
                $rootScope.$digest();

                expect(successCallback).toHaveBeenCalled();

                var actualFormAttributeData = successCallback.calls.mostRecent().args[0];
                expect(actualFormAttributeData.id).toEqual(mockFormAttributeDataResponse.id);
                expect(actualFormAttributeData.key).toEqual(formattributesDataToUpdate.key);
                expect(actualFormAttributeData.label).toEqual(formattributesDataToUpdate.label);
            });

            it('using save should call the correct url and return the correct data', function () {
                var successCallback = jasmine.createSpy('success');
                spyOn(FormAttributeEndpoint, 'update').and.callThrough();
                FormAttributeEndpoint.save({id: 1, formId: 1}).$promise.then(successCallback);
                expect(FormAttributeEndpoint.update).toHaveBeenCalled();
            });

            it('should return an id when deleting an entity', function () {
                var successCallback = jasmine.createSpy('success');
                $httpBackend.expectDELETE(BACKEND_URL + '/api/v2/forms/1/attributes/1?order=asc&orderby=priority').respond(mockFormAttributeDataResponse);

                FormAttributeEndpoint.delete({id: 1, formId: 1}).$promise.then(successCallback);

                $httpBackend.flush();
                $rootScope.$digest();

                expect(successCallback).toHaveBeenCalled();

                var actualFormAttributeData = successCallback.calls.mostRecent().args[0];
                expect(actualFormAttributeData.id).toEqual(mockFormAttributeDataResponse.id);
            });

            it('using delete should call the correct url and return the correct data', function () {
                var successCallback = jasmine.createSpy('success');

                spyOn(FormAttributeEndpoint, 'delete').and.callThrough();

                FormAttributeEndpoint.delete({id: 1, formId: 1}).$promise.then(successCallback);
                expect(FormAttributeEndpoint.delete).toHaveBeenCalled();
            });
        });
    });
});
