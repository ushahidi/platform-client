import React from "react";
import PropTypes from "prop-types";
import Link from "react/react-transition/Link";

const TestRouteContainer = props => (
    <div>
        <main role="main">
            <h1>Hello from react</h1>
            {props.id}
            <Link to="posts.data">Click me! I&apos;m a &lt;Link&gt; tag</Link>
        </main>
    </div>
);

TestRouteContainer.propTypes = {
    id: PropTypes.string.isRequired
};

export default TestRouteContainer;
