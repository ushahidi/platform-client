import * as React from "react";
import PropTypes from "prop-types";

import classnames from "classnames";
import label from "./label.scss";

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
    const classProps = classnames(
        label.label,
        label[className],
        label[LabelType[labelType]]
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
