import React from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import Uirouter from '@uirouter/angularjs';

import * as UshLogoActions from './ush-logo.actions';
import { getFormsFromState } from './ush-logo.reducer';

const MyComponent = props => (
  <div>
    <p className="foo">Foo: {props.foo}</p>
    <p className="baz">Baz: {props.baz}</p>
  </div>
);

const mapStateToProps = (state) => {
    return {
        ratings: getFormsFromState(state)
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

export default connect(mapStateToProps, mapDispatchToProps)(MyComponent)
