var rootPath = '../../../../';

describe('Notify', function () {

    var Notify, $rootScope,
    mockSliderService = {
        openUrl: function () {},
        openTemplate: function () {},
        close: function () {}
    },
    mockModalService = {
        openUrl: function () {},
        openTemplate: function () {},
        close: function () {}
    };

    beforeEach(function () {
        var testApp = angular.module('testApp');
        testApp.service('Notify', require(rootPath + 'app/common/notifications/notify.service.js'))
        .service('SliderService', function () {
            return mockSliderService;
        })
        .service('ModalService', function () {
            return mockModalService;
        })
        ;

        require(rootPath + 'test/unit/simple-test-app-config.js')(testApp);
    });

    beforeEach(angular.mock.module('testApp'));

    beforeEach(inject(function (_$rootScope_, _Notify_, _$window_) {
        $rootScope = _$rootScope_;
        Notify = _Notify_;
    }));

    describe('error', function () {
        beforeEach(function () {
            spyOn(mockSliderService, 'openTemplate').and.callThrough();
            Notify.error('Test message');
            $rootScope.$digest();
        });

        it('Calls SliderService.openTemplate with error message', function () {
            expect(mockSliderService.openTemplate).toHaveBeenCalledWith('<p>Test message</p>', 'warning', 'error');
        });
    });

    describe('errors', function () {
        beforeEach(function () {
            spyOn(mockSliderService, 'openUrl').and.callThrough();
            Notify.errors(['Test message 1', 'Test message 2']);
            $rootScope.$digest();
        });

        it('Calls SliderService.openUrl with error template + scope', function () {
            expect(mockSliderService.openUrl).toHaveBeenCalledWith('templates/common/notifications/api-errors.html', 'warning', 'error', jasmine.objectContaining({ errors: ['Test message 1', 'Test message 2']}));
        });
    });

    describe('notify', function () {
        beforeEach(function () {
            spyOn(mockSliderService, 'openTemplate').and.callThrough();
            Notify.notify('Test message');
            $rootScope.$digest();
        });

        it('calls $rootScope.$on with the combined alert messages', function () {
            expect(mockSliderService.openTemplate).toHaveBeenCalledWith('<p>Test message</p>');
        });
    });

    describe('apiErrors', function () {
        beforeEach(function () {
            spyOn(mockSliderService, 'openUrl').and.callThrough();
            Notify.apiErrors({
                data: {
                    errors: [
                        { message: 'Error 1' },
                        { message: 'Error 2' }
                    ]
                }
            });
            $rootScope.$digest();
        });

        it('Calls SliderService.openTemplate with error message', function () {
            expect(mockSliderService.openUrl).toHaveBeenCalledWith('templates/common/notifications/api-errors.html', 'warning', 'error', jasmine.objectContaining({ errors: ['Error 1', 'Error 2']}));
        });
    });

    describe('success', function () {
        beforeEach(function () {
            spyOn(mockSliderService, 'openTemplate').and.callThrough();
            Notify.success('Test message');
            $rootScope.$digest();
        });

        it('Calls SliderService.openTemplate with message', function () {
            expect(mockSliderService.openTemplate).toHaveBeenCalledWith('<p>Test message</p>', 'thumb-up', 'confirmation');
        });
    });

    describe('confirm', function () {
        beforeEach(function () {
            spyOn(mockSliderService, 'openTemplate').and.callThrough();
            Notify.confirm('Test message');
            $rootScope.$digest();
        });

        it('Calls SliderService.openTemplate with message', function () {
            expect(mockSliderService.openTemplate).toHaveBeenCalledWith(jasmine.any(String), 'question-mark', false, jasmine.any(Object));
        });
    });

    describe('confirmModal', function () {
        beforeEach(function () {
            spyOn(mockModalService, 'openTemplate').and.callThrough();
            Notify.confirmModal('Test message');
            $rootScope.$digest();
        });

        it('Calls ModalService.openTemplate with error message', function () {
            expect(mockModalService.openTemplate).toHaveBeenCalled();
        });
    });

    describe('confirmDelete', function () {
        beforeEach(function () {
            spyOn(mockModalService, 'openTemplate').and.callThrough();
            Notify.confirmDelete('Test message');
            $rootScope.$digest();
        });

        it('Calls ModalService.openTemplate with error message', function () {
            expect(mockModalService.openTemplate).toHaveBeenCalled();
        });
    });

    describe('limit', function () {
        beforeEach(function () {
            spyOn(mockSliderService, 'openUrl').and.callThrough();
            Notify.limit('Test message');
            $rootScope.$digest();
        });

        it('Calls SliderService.openUrl with error message', function () {
            expect(mockSliderService.openUrl).toHaveBeenCalledWith('templates/common/notifications/limit.html', 'warning', 'error', jasmine.objectContaining({ message: 'Test message'}));
        });
    });

});
