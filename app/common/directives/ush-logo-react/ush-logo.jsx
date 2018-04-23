import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { render } from 'react-dom';


class MyComponent extends Component {

  render() {
    return <div>
      <p>Foo: {this.props.foo}</p>
      <p>Baz: {this.props.baz}</p>
    </div>
  }
}

export default MyComponent;

MyComponent.propTypes = {foo: PropTypes.number,baz: PropTypes.number}
