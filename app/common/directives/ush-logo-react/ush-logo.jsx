import React from 'react';
import PropTypes from 'prop-types';
//import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
// import { UISref, UIView, pushStateLocationPlugin } from '@uirouter/react';
// <UISref to="posts.data"><a>Data View UISref</a></UISref>

import connectWithStore from '../../../react-transition/connectWithStore.jsx';
import * as UshLogoActions from './ush-logo.actions';
import { getFormsFromState } from './ush-logo.reducer';

const MyComponent = props => (
  <div>
    Data from redux store: { props.forms && props.forms[0].id}
    <p className="foo">Passed into component Foo: {props.foo}</p>
    <p className="baz">Passed into component Baz: {props.baz}</p>
    <p>Passed from parent angular component Test: {props.test}</p>
    <a href='/views/data'>Route from react to angular (data view)</a>
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
  baz: PropTypes.number.isRequired,
  test: PropTypes.string.isRequired
};

export default connectWithStore(MyComponent, mapStateToProps, mapDispatchToProps);
