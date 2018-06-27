import * as React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import "./formfield.scss";

const propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    errorText: PropTypes.string,
    legend: PropTypes.string,
    required: PropTypes.bool,
    showError: PropTypes.bool
};

const Fieldset = props => {
    const {
        children,
        className,
        errorText,
        showError,
        legend,
        required
    } = props;

    const fieldsetClassNames = classnames(className, showError ? "error" : "");

    const legendClassNames = classnames(
        required ? "required" : "",
        showError ? "error" : ""
    );

    const errorClassNames = "error";

    return (
        <fieldset className={fieldsetClassNames}>
            <legend className={legendClassNames}>{legend}</legend>
            {children}
            {showError ? (
                <span className={errorClassNames}>{errorText}</span>
            ) : (
                ""
            )}
        </fieldset>
    );
};

Fieldset.propTypes = propTypes;

Fieldset.defaultProps = {
    className: "",
    errorText: "",
    legend: "",
    showError: false,
    required: false
};

export default Fieldset;
