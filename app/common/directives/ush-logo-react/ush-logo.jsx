import React, { Component } from 'react';
import { render } from 'react-dom';


class MyComponent extends Component {
  render() {
    return <div>
      <p>FooBar: {this.props.fooBar}</p>
      <p>Baz: {this.props.baz}</p>
    </div>
  }
}

export default MyComponent;
