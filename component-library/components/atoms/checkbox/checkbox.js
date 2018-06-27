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
    inForm: PropTypes.bool,
    isError: PropTypes.bool
};

const Checkbox = props => {
    const {
        checkType,
        className,
        children,
        isError,
        id,
        inForm,
        ...customProps
    } = props;
    const classProps = classnames(
        checkbox.check,
        checkbox[className],
        checkbox[CheckType[checkType]],
        inForm ? `form-field ${CheckType[checkType]}` : "",
        isError ? "error" : ""
    );

    return (
        <div className={classProps}>
            <input type={CheckType[checkType]} id={id} {...customProps} />
            <Label htmlFor={id}>{children}</Label>
        </div>
    );
};

Checkbox.propTypes = propTypes;

Checkbox.defaultProps = {
    className: "",
    inForm: false,
    isError: false
};

export default Checkbox;
