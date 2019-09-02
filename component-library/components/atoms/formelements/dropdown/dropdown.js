import * as React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import dropdown from "../forms.scss";

const propTypes = {
    className: PropTypes.string,
    options: PropTypes.shape.isRequired
};

const Dropdown = props => {
    const { className, options, ...customProps } = props;
    let classes = className.split(" ");
    classes = classes.map(classname => dropdown[classname]);
    const classProps = classnames(dropdown["custom-select"], classes);
    return (
        <div className={classProps}>
            <select
                className={`${dropdown.select} ${dropdown.error}`}
                {...customProps}
            >
                {options.map(option => (
                    <option
                        disabled={option.disabled ? option.disabled : false}
                        value={option.value}
                        selected={option.selected ? option.selected : ""}
                    >
                        {option.name}
                    </option>
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
