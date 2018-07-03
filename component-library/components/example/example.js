import * as React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import example from "./example.scss";
// import Neccessary components here:
// import Button from "./atoms/button/button";

const propTypes = {
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
    otherPropsNeeded: PropTypes.bool
};

const Example = props => {
    const { className, children, otherPropsNeeded, ...customProps } = props;
    const classProps = classnames(example.example, className);

    return (
        <div
            className={classProps}
            otherPropsNeeded={otherPropsNeeded}
            {...customProps}
        >
            {/* comments looks like this */
            /* add template-code below. */}
            {children}
        </div>
    );
};

Example.propTypes = propTypes;

Example.defaultProps = {
    className: "",
    otherPropsNeeded: true
};

export default Example;
