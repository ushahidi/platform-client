import React from 'react';
import PropTypes from 'prop-types';

const MyComponent = props => (
  <div>
    <p className="foo">Foo: {props.foo}</p>
    <p className="baz">Baz: {props.baz}</p>
  </div>
);

export { MyComponent as default };

MyComponent.propTypes = {
  foo: PropTypes.number.isRequired,
  baz: PropTypes.number.isRequired
};
