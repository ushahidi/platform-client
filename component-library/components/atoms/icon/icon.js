import * as React from "react";
import PropTypes from "prop-types";
import SVG from "./svg.js";

const propTypes = {
    icon: PropTypes.string.isRequired,
    width: PropTypes.number,
    height: PropTypes.number
};

const Icon = props => {
    const { icon, width, height } = props;

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            viewBox="0 0 8 8"
            className="iconic"
        >
            <path d={SVG[icon]} />
        </svg>
    );
};

Icon.propTypes = propTypes;
Icon.defaultProps = {
    width: 12,
    height: 12
};
export default Icon;
