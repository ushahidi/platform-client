import * as React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import loader from "./loader.scss";

const LoaderType = {
    LOADER: "loading-bar",
    ALT: "loading-bar-alt",
    LOGO: "loader-logo"
};

const propTypes = {
    loaderType: PropTypes.string,
    className: PropTypes.string
};

const Loader = props => {
    const { loaderType, className, ...customProps } = props;

    const classProps = classnames(
        loader.loader,
        loader[LoaderType[loaderType]],
        loader[className]
    );

    return <div className={classProps} {...customProps} />;
};

Loader.propTypes = propTypes;

Loader.defaultProps = {
    loaderType: LoaderType.LOADER,
    className: ""
};

export default Loader;
