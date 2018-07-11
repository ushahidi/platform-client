import * as React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import dropdown from "../forms.scss";

const propTypes = {
    className: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.object).isRequired,
    defaultString: PropTypes.string.isRequired
};

const Dropdown = props => {
    const { className, options, defaultString, ...customProps } = props;
    let classes = className.split(" ");
    classes = classes.map(classname => dropdown[classname]);
    const classProps = classnames(dropdown["custom-select"], classes);
    return (
        <div className={classProps}>
            <select
                className={`${dropdown.select} ${dropdown.error}`}
                {...customProps}
            >
                <option value="">{defaultString}</option>
                {options.map(option => (
                    <option
                        key={option.id}
                        disabled={option.disabled ? option.disabled : false}
                        value={option.value}
                    >
                        {option.display_name
                            ? option.display_name
                            : option.name}
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
