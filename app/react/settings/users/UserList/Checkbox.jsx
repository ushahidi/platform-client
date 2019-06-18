import React from "react";
import PropTypes from "prop-types";

const propTypes = {
    userId: PropTypes.number.isRequired
};
// Check if the userId is in selectedUsers, if it is, checkbox should be checked
// Once the user checks the checkbox, it should add the userId to the selectedUsers
const CheckBox = props => (
    <div className="listing-item-select">
        <input type="Checkbox" value={props.userId} />
    </div>
);

CheckBox.propTypes = propTypes;

export default CheckBox;
