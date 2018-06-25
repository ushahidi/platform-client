import * as React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import input from "./input.scss";

const InputType = {
    TEXT: "text",
    PASSWORD: "password",
    EMAIL: "email",
    SEARCH: "search",
    PHONE: "phone"
};

const propTypes = {
    className: PropTypes.string,
    inputType: PropTypes.string
};

const Input = props => {
    const { className, inputType, ...customProps } = props;
    let classes = className.split(" ");
    classes = classes.map(classname => input[classname]);
    const classProps = classnames(
        input.input,
        classes,
        input[InputType[inputType]]
    );

    return (
        <input
            type={InputType[inputType]}
            className={classProps}
            {...customProps}
        />
    );
};
Input.propTypes = propTypes;

Input.defaultProps = {
    className: "",
    inputType: "TEXT"
};

export default Input;
