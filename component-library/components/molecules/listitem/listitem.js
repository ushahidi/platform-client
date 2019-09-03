import * as React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import "./listitem.scss";

const propTypes = {
    className: PropTypes.string,
    children: PropTypes.node.isRequired
};

const ListItem = props => {
    const { className, children, ...customProps } = props;
    const classProps = classnames("list-item", className);
    return (
        <li {...customProps} className={classProps}>
            {children}
        </li>
    );
};
ListItem.propTypes = propTypes;

ListItem.defaultProps = {
    className: ""
};

export default ListItem;
