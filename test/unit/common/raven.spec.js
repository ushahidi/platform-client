import RavenService from 'app/common/raven/raven.service';

describe('Raven service', () => {
    let raven, $rootScope, Raven, Session;

    beforeEach(() => {
        $rootScope = {
            $emit: (ev) => {},
            $on: (ev) => {}
        };

        let mockedSessionData = {
            email: 'robbie@ushahidi.com',
            name: 'Robbie',
            userId: 10
        };
        Session =  {
            getSessionDataEntry: function (key) {
                return mockedSessionData[key];
            },
            setSessionDataEntry: function (key, value) {
                mockedSessionData[key] = value;
            }
        };

        Raven = {
            setUserContext: jasmine.createSpy('setUserContext')
        };

        global.RAVEN_DSN = 'http://abc123';

        spyOn($rootScope, '$emit');
        spyOn($rootScope, '$on');

        raven = new RavenService($rootScope, Session, Raven);
    });

    it('should listen to log in/out events', () => {
        raven.init();

        expect($rootScope.$on).toHaveBeenCalledWith('event:authentication:login:succeeded', jasmine.any(Function));
        expect($rootScope.$on).toHaveBeenCalledWith('event:authentication:logout:succeeded', jasmine.any(Function));

        expect(Raven.setUserContext).toHaveBeenCalled();
    });

    it('should set user at creation if logged in', () => {
        Session.setSessionDataEntry('userId', 10);
        raven.init();

        expect(Raven.setUserContext).toHaveBeenCalled();
    });

    it('should not set user at creation if logged out', () => {
        Session.setSessionDataEntry('userId', false);
        raven.init();


        expect(Raven.setUserContext).not.toHaveBeenCalled();
    });

    it('should set user on login', () => {
        raven.init();
        raven.handleLogin();

        expect(Raven.setUserContext).toHaveBeenCalledWith({
            id: 10
        });
    });

    it('should clear user on logout', () => {
        raven.init();
        raven.handleLogout();

        expect(Raven.setUserContext).toHaveBeenCalledWith({});
    });
});
