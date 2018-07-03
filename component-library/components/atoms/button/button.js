import * as React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import button from "./button.scss";

const ButtonType = {
    BUTTON: "button",
    BETA: "button-beta",
    GAMMA: "button-gamma",
    DESTRUCTIVE: "button-destructive"
};
const propTypes = {
    buttonType: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.node.isRequired
};
const Button = props => {
    const { buttonType, className, children, ...customProps } = props;

    const classProps = classnames(
        button.button,
        button[ButtonType[buttonType]],
        button[className]
    );

    return (
        <button type="button" className={classProps} {...customProps}>
            {children}
        </button>
    );
};
Button.propTypes = propTypes;

Button.defaultProps = {
    buttonType: ButtonType.BUTTON,
    className: ""
};

export default Button;
