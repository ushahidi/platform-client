import * as React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import loader from "./loader.scss";
import logo from "./ushahidi-logo-blue.png";

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

    return (
        <div>
            {loaderType === "LOGO" ? (
                <div className={classProps} {...customProps}>
                    <img src="{logo}" alt="Ushahidi Logo" />
                    <div className="loading-bar-alt" />
                </div>
            ) : (
                <div className={classProps} {...customProps} />
            )}
        </div>
    );
};

Loader.propTypes = propTypes;

Loader.defaultProps = {
    loaderType: LoaderType.LOADER,
    className: ""
};

export default Loader;
