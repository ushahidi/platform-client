import * as React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import "./search.scss";

const propTypes = {
    className: PropTypes.string,
    children: PropTypes.node.isRequired
};

const Search = props => {
    const { className, children, ...customProps } = props;
    const classProps = classnames("search", className);
    return (
        <div className={classProps} {...customProps}>
            {children}
        </div>
    );
};
Search.propTypes = propTypes;

Search.defaultProps = {
    className: ""
};

export default Search;
