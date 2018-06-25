import * as React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import formfield from "./formfield.scss";

const propTypes = {
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
    showError: PropTypes.bool,
    errorText: PropTypes.string
};

const Formfield = props => {
    const { className, children, showError, errorText, ...customProps } = props;

    let classes = className.split(" ");
    classes = classes.map(classname => formfield[classname]);

    const classProps = showError
        ? classnames(formfield["form-field"], formfield.error, classes)
        : classnames(formfield["form-field"], classes);

    return (
        <div className={classProps} {...customProps}>
            {children}
            {showError ? (
                <span className={formfield.error}>{errorText}</span>
            ) : (
                ""
            )}
        </div>
    );
};

Formfield.propTypes = propTypes;

Formfield.defaultProps = {
    className: "",
    showError: false,
    errorText: ""
};

export default Formfield;
