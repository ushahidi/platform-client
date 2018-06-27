import * as React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

const propTypes = {
    children: PropTypes.node.isRequired
};

const Form = props => {
    const { children } = props;

    const classProps = classnames();

    return <form className={classProps}>{children}</form>;
};

Form.propTypes = propTypes;

Form.defaultProps = {};

export default Form;
