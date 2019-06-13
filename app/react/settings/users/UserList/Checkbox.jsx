import React from "react";
import PropTypes from "prop-types";

const propTypes = {
    userId: PropTypes.string.isRequired
};

const CheckBox = props => (
    <div className="listing-item-select">
        <input type="Checkbox" value={props.userId} />
    </div>
);

CheckBox.propTypes = propTypes;

export default CheckBox;
