import React from 'react';
import PropTypes from 'prop-types';

const MyComponent = props => (
  <div>
    <p>Foo: {props.foo}</p>
    <p>Baz: {props.baz}</p>
  </div>
);

export { MyComponent as default };

MyComponent.propTypes = {
  foo: PropTypes.number.isRequired,
  baz: PropTypes.number.isRequired,
};
