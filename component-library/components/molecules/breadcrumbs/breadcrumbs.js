import * as React from "react";
import PropTypes from "prop-types";

import classnames from "classnames";
import breadcrumbs from "./breadcrumbs.scss";

const propTypes = {
    className: PropTypes.string,
    navigation: PropTypes.arrayOf(
        PropTypes.shape({
            path: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired
        })
    ).isRequired
};

const Breadcrumbs = props => {
    const { className, navigation } = props;

    let classes = className.split(" ");
    classes = classes.map(classname => breadcrumbs[classname]);

    const classProps = classnames(breadcrumbs.breadcrumbs, classes);
    return (
        <ol className={classProps}>
            {navigation.map(nav => (
                <li>
                    <a href={nav.path}>{nav.name}</a>
                </li>
            ))}
        </ol>
    );
};

Breadcrumbs.propTypes = propTypes;

Breadcrumbs.defaultProps = {
    className: ""
};

export default Breadcrumbs;
