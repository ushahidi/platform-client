import * as React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import checkbox from "./checkbox.scss";
import Label from "../label/label";

const CheckType = {
    CHECKBOX: "checkbox",
    RADIO: "radio"
};

const propTypes = {
    checkType: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    id: PropTypes.string.isRequired,
    isFieldset: PropTypes.bool,
    isError: PropTypes.bool
};

const Checkbox = props => {
    const {
        checkType,
        className,
        children,
        isError,
        id,
        isFieldset,
        ...customProps
    } = props;
    const classProps = classnames(
        checkbox.check,
        checkbox[className],
        checkbox[CheckType[checkType]]
    );
    const labelClass = classnames(
        isFieldset ? "form-field" : "",
        isError ? "error" : ""
    );
    return (
        <div className={isFieldset ? checkbox["form-field"] : ""}>
            <input
                className={classProps}
                type={CheckType[checkType]}
                id={id}
                {...customProps}
            />
            <Label className={labelClass} htmlFor={id}>
                {children}
            </Label>
        </div>
    );
};

Checkbox.propTypes = propTypes;

Checkbox.defaultProps = {
    className: "",
    isFieldset: false,
    isError: false
};

export default Checkbox;
