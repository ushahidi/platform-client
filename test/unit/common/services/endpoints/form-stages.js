var rootPath = '../../../../../';

describe('FormStageEndpoint', function () {

    var $rootScope,
        $httpBackend,
        BACKEND_URL,
        FormStageEndpoint;


    beforeEach(function () {
        var testApp = angular.module('testApp', [
        'ngResource',
        'angular-cache'
        ])
        .service('FormStageEndpoint', require(rootPath + 'app/common/services/endpoints/form-stages.js'))
        .config(require(rootPath + 'app/common/configs/cache-config.js'));

        require(rootPath + 'test/unit/simple-test-app-config.js')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(inject(function (_$httpBackend_, _$rootScope_, _CONST_, _FormStageEndpoint_) {
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
        BACKEND_URL = _CONST_.BACKEND_URL;
        FormStageEndpoint = _FormStageEndpoint_;
    }));

    describe('"form-stages/:id" for data of all form-stages', function () {
        describe('get all form-stages', function () {

            var mockFormStageDataResponse;

            beforeEach(function () {
                mockFormStageDataResponse =
                {
                    'count': 2,
                    'results': [
                        {
                            'id': 1,
                            'url': 'http://192.168.33.110/api/v3/form_stages/1',
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
                            'url': 'http://192.168.33.110/api/v3/form_stages/2',
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
                    'curr': 'http://192.168.33.110/api/v3/form/1/stages?orderby=id&order=asc&offset=0',
                    'next': 'http://192.168.33.110/api/v3/form/1/stages?orderby=id&order=asc&offset=0',
                    'prev': 'http://192.168.33.110/api/v3/form/1/stages?orderby=id&order=asc&offset=0',
                    'total_count': 2
                };
            });

            it('should call the correct url and parse and return the correct data', function () {
                var successCallback = jasmine.createSpy('success');
                $httpBackend.expectGET(BACKEND_URL + '/api/v2/forms/1/stages?order=asc&orderby=priority').respond(mockFormStageDataResponse);

                FormStageEndpoint.queryFresh({formId: 1}).$promise.then(successCallback);

                $httpBackend.flush();
                $rootScope.$digest();

                expect(successCallback).toHaveBeenCalled();

                var actualFormStageData = successCallback.calls.mostRecent().args[0];
                expect(actualFormStageData.length).toEqual(mockFormStageDataResponse.results.length);
                expect(actualFormStageData[0].key).toEqual(mockFormStageDataResponse.results[0].key);
            });
        });
    });

    describe('get data for "form-stages/1"', function () {

        var mockFormStageDataResponse;

        beforeEach(function () {
            mockFormStageDataResponse = {
                'id': 1,
                'url': 'http://192.168.33.110/api/v3/form_stages/1',
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

        describe('get form-stages data', function () {
            it('should call the correct url and return the correct data', function () {
                var successCallback = jasmine.createSpy('success');
                $httpBackend.expectGET(BACKEND_URL + '/api/v2/forms/1/stages/1?order=asc&orderby=priority').respond(mockFormStageDataResponse);
                FormStageEndpoint.get({id: 1, formId: 1}).$promise.then(successCallback);

                $httpBackend.flush();
                $rootScope.$digest();

                expect(successCallback).toHaveBeenCalled();

                var actualFormStageData = successCallback.calls.mostRecent().args[0];
                expect(actualFormStageData.id).toEqual(mockFormStageDataResponse.id);
                expect(actualFormStageData.key).toEqual(mockFormStageDataResponse.key);
                expect(actualFormStageData.label).toEqual(mockFormStageDataResponse.label);
            });

            it('using getFresh should call the correct url and return the correct data', function () {
                var successCallback = jasmine.createSpy('success');

                spyOn(FormStageEndpoint, 'get').and.callThrough();

                FormStageEndpoint.getFresh({id: 1, formId: 1}).$promise.then(successCallback);
                expect(FormStageEndpoint.get).toHaveBeenCalled();
            });

        });

        describe('update form-stages data', function () {
            beforeEach(function () {
                mockFormStageDataResponse = {
                    'id': 1,
                    'url': 'http://192.168.33.110/api/v3/form_stages/1',
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

            it('should call the correct url and return the updated form-stages data', function () {
                var successCallback = jasmine.createSpy('success');
                $httpBackend.expectPUT(BACKEND_URL + '/api/v2/forms/1/stages/1?order=asc&orderby=priority').respond(mockFormStageDataResponse);

                var formstagesDataToUpdate = {
                    'id': 1,
                    'formId': 1,
                    'key': 'test_varchar',
                    'label': 'Test varchar'
                };

                FormStageEndpoint.update(formstagesDataToUpdate).$promise.then(successCallback);

                $httpBackend.flush();
                $rootScope.$digest();

                expect(successCallback).toHaveBeenCalled();

                var actualFormStageData = successCallback.calls.mostRecent().args[0];
                expect(actualFormStageData.id).toEqual(mockFormStageDataResponse.id);
                expect(actualFormStageData.key).toEqual(formstagesDataToUpdate.key);
                expect(actualFormStageData.label).toEqual(formstagesDataToUpdate.label);
            });

            it('using saveCache should call the correct url and return the correct data', function () {
                var successCallback = jasmine.createSpy('success');

                spyOn(FormStageEndpoint, 'update').and.callThrough();

                FormStageEndpoint.saveCache({id: 1, formId: 1}).$promise.then(successCallback);
                expect(FormStageEndpoint.update).toHaveBeenCalled();
            });

            it('should return an id when deleting an entity', function () {
                var successCallback = jasmine.createSpy('success');
                $httpBackend.expectDELETE(BACKEND_URL + '/api/v2/forms/1/stages/1?order=asc&orderby=priority').respond(mockFormStageDataResponse);

                FormStageEndpoint.deleteEntity({id: 1, formId: 1}).$promise.then(successCallback);

                $httpBackend.flush();
                $rootScope.$digest();

                expect(successCallback).toHaveBeenCalled();

                var actualFormStageData = successCallback.calls.mostRecent().args[0];
                expect(actualFormStageData.id).toEqual(mockFormStageDataResponse.id);
            });

            it('using delete should call the correct url and return the correct data', function () {
                var successCallback = jasmine.createSpy('success');

                spyOn(FormStageEndpoint, 'deleteEntity').and.callThrough();

                FormStageEndpoint.delete({id: 1, formId: 1}).$promise.then(successCallback);
                expect(FormStageEndpoint.deleteEntity).toHaveBeenCalled();
            });
        });
    });
});
