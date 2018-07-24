import * as React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import dropdown from "../forms.scss";

const propTypes = {
    className: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.object).isRequired,
    defaultString: PropTypes.string.isRequired,
    input: PropTypes.shape({
        value: PropTypes.string
    })
};

const Dropdown = props => {
    const { className, options, defaultString, input, ...customProps } = props;
    let classes = className.split(" ");
    classes = classes.map(classname => dropdown[classname]);
    const classProps = classnames(dropdown["custom-select"], classes);
    return (
        <div className={classProps}>
            <select
                className={`${dropdown.select} ${dropdown.error}`}
                {...input}
                {...customProps}
            >
                <option value="">{defaultString}</option>
                {options.map(option => (
                    <option
                        key={option.id}
                        disabled={option.disabled ? option.disabled : false}
                        value={option.name}
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
    className: "",
    input: {
        value: ""
    }
};

export default Dropdown;
