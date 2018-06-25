import * as React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import checkbox from "./checkbox.scss";

const CheckType = {
    CHECKBOX: "checkbox",
    RADIO: "radio"
};

const propTypes = {
    checkType: PropTypes.string.isRequired,
    className: PropTypes.string,
    id: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired
};

const Checkbox = props => {
    const { checkType, className, children, id, ...customProps } = props;
    const classProps = classnames(
        checkbox.check,
        checkbox[className],
        checkbox[CheckType[checkType]]
    );

    return (
        <div>
            <input
                className={classProps}
                type={CheckType[checkType]}
                id={id}
                {...customProps}
            />
            <label htmlFor={id}>{children}</label>
        </div>
    );
};

Checkbox.propTypes = propTypes;

Checkbox.defaultProps = {
    className: ""
};

export default Checkbox;
