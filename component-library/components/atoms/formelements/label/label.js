import * as React from "react";
import PropTypes from "prop-types";

import classnames from "classnames";
import label from "../forms.scss";

const LabelType = {
    DEFAULT: "label",
    ERROR: "error",
    REQUIRED: "required"
};

const propTypes = {
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
    labelType: PropTypes.string
};

const Label = props => {
    const { className, children, labelType, ...customProps } = props;
    let classes = className.split(" ");
    classes = classes.map(classname => label[classname]);
    const classProps = classnames(
        label.label,
        label[LabelType[labelType]],
        classes
    );
    // Disabling jsx-a11y/label-has-for since this is comint through customProps
    /* eslint-disable jsx-a11y/label-has-for */
    return (
        <label className={classProps} {...customProps}>
            {children}
        </label>
    );
    /* eslint-enable jsx-a11y/label-has-for */
};

Label.propTypes = propTypes;

Label.defaultProps = {
    className: "",
    labelType: "DEFAULT"
};

export default Label;
