import React from "react";
import PropTypes from "prop-types";

const propTypes = {
    userId: PropTypes.number.isRequired,
    handleChange: PropTypes.func.isRequired
};
class CheckBox extends React.Component {
    constructor(props) {
        super(props);
        this.toggleUser = this.toggleUser.bind(this);
    }

    toggleUser(event) {
        // we need to do event.persist() to get the actual value from the checkbox
        event.persist();
        this.props.handleChange(event.target.value);
    }

    render() {
        return (
            <div className="listing-item-select">
                <input
                    type="Checkbox"
                    value={this.props.userId}
                    onChange={this.toggleUser}
                />
            </div>
        );
    }
}

CheckBox.propTypes = propTypes;

export default CheckBox;
