import React from 'react';
import { connect } from "react-redux";

const connectWithStore = (WrappedComponent, ...args) => {
  const ConnectedWrappedComponent = connect(...args)(WrappedComponent);

  return (props) => {
    // Get the injector + store at render time
    // Otherwise it happens before the angular app is set up
    const injector = angular.element(document).injector();
    const store = injector.get('$ngRedux');
    return (
      <ConnectedWrappedComponent {...props} store={store}/>
    );
  }
};

export default connectWithStore;
