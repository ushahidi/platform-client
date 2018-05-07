import React from 'react';
import PropTypes from 'prop-types';
//import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import Uirouter from '@uirouter/angularjs';

import connectWithStore from '../../../react-transition/connectWithStore.jsx';
import * as UshLogoActions from './ush-logo.actions';
import { getFormsFromState } from './ush-logo.reducer';

const MyComponent = props => (
  <div>
    {props.forms[0].id}
    <p className="foo">Foo: {props.foo}</p>
    <p className="baz">Baz: {props.baz}</p>
  </div>
);

const mapStateToProps = (state) => {
    return {
        forms: getFormsFromState(state)
    }
};

function mapDispatchToProps(dispatch) {
    return {
        UshLogoActions: bindActionCreators(UshLogoActions, dispatch),
    };
};

MyComponent.propTypes = {
  foo: PropTypes.number.isRequired,
  baz: PropTypes.number.isRequired
};

export default connectWithStore(MyComponent, mapStateToProps, mapDispatchToProps);
