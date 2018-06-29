import * as React from "react";
import PropTypes from "prop-types";

import classnames from "classnames";

const propTypes = {
    className: PropTypes.string,
    children: PropTypes.node.isRequired
};

const Buttongroup = props => {
    const { className, children, ...customProps } = props;
    const classProps = classnames("button-group", className);
    return (
        <div className={classProps} {...customProps}>
            {children}
        </div>
    );
};

Buttongroup.propTypes = propTypes;

Buttongroup.defaultProps = {
    className: ""
};

export default Buttongroup;
