import * as React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import dropdown from "./dropdown.scss";

const propTypes = {
    className: PropTypes.string,
    options: PropTypes.shape.isRequired
};

const Dropdown = props => {
    const { className, options, ...customProps } = props;
    const classProps = classnames(
        dropdown["custom-select"],
        dropdown[className]
    );
    return (
        <div className={classProps}>
            <select className={dropdown.select} {...customProps}>
                {options.map(option => (
                    <option value={option.value}>{option.name}</option>
                ))}
            </select>
        </div>
    );
};

Dropdown.propTypes = propTypes;

Dropdown.defaultProps = {
    className: ""
};

export default Dropdown;
