import * as React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import "./formfield.scss";
import Icon from "../../atoms/icon/icon";

const propTypes = {
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
    showError: PropTypes.bool,
    errorText: PropTypes.string
};

const Formfield = props => {
    const { className, children, showError, errorText, ...customProps } = props;

    const classProps = showError
        ? classnames("form-field", "error", className)
        : classnames("form-field", className);
    return (
        <div className={classProps} {...customProps}>
            {children}
            {showError ? (
                <span className="error">
                    <Icon icon="WARNING" />
                    {errorText}
                </span>
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
