import React from "react";
import { connect } from "react-redux";
import angular from "angular";

const connectWithStore = (WrappedComponent, ...args) => {
    const ConnectedWrappedComponent = connect(...args)(WrappedComponent);

    const ConnectedComponentWithStore = props => {
        // Get the injector + store at render time
        // Otherwise it happens before the angular app is set up
        const injector = angular.element(document).injector();
        const store = injector.get("$ngRedux");
        return <ConnectedWrappedComponent store={store} {...props} />;
    };
    ConnectedComponentWithStore.propTypes = WrappedComponent.propTypes;

    return ConnectedComponentWithStore;
};

export default connectWithStore;
