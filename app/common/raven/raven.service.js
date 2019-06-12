class RavenService {
    constructor($rootScope, Session, Raven) {
        'ngInject';
        this.$rootScope = $rootScope;
        this.Session = Session;
        this.Raven = Raven;
    }

    init() {
        this.$rootScope.$on('event:authentication:login:succeeded', this.handleLogin.bind(this));
        this.$rootScope.$on('event:authentication:logout:succeeded', this.handleLogout.bind(this));

        if (this.Session.getSessionDataEntry('userId')) {
            this.handleLogin();
        }
    }

    handleLogin() {
        if (this.Session.getSessionDataEntry('userId')) {
            this.Raven.setUserContext({
                id: this.Session.getSessionDataEntry('userId')
            });
        } else {
            this.Raven.setUserContext({});
        }
    }

    handleLogout() {
        this.Raven.setUserContext({});
    }

}

export default RavenService;
