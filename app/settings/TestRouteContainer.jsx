import React from "react";
import PropTypes from "prop-types";
import Link from "../react-transition/Link";

const TestRouteContainer = props => (
  <div>
    <main role="main">
      <h1>Hello from react</h1>
      {props.id}
      <a href="/views/map">Click me</a>
      <Link to="posts.data">Testing a link string</Link>
      <Link
        to={{
          to: "posts.data",
          hash: "#the-hash"
        }}
      >
        testing a link object?????
      </Link>
    </main>
  </div>
);

TestRouteContainer.propTypes = {
  id: PropTypes.string.isRequired
};

export default TestRouteContainer;
