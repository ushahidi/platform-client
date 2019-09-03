import React from "react";
import Modal from "react-modal";
import PropTypes from "prop-types";

// TODO: REMOVE - defer to CSS. This is just for testing
const customStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        width: "40%",
        height: "20%",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)"
    }
};

const propTypes = {
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    message: PropTypes.string.isRequired,
    isOpen: PropTypes.bool.isRequired
};

class NavigationConfirmModal extends React.Component {
    constructor(props) {
        super(props);
        // see: http://reactcommunity.org/react-modal/accessibility/
        Modal.setAppElement(document.getElementById("root"));

        this.state = {};
    }
    render() {
        return (
            <Modal
                when
                isOpen={this.props.isOpen}
                style={customStyles}
                contentLabel="Confirmation Modal"
            >
                <h2>Confirm Navigation</h2>
                <div>{this.props.message}</div>
                <div>
                    <button onClick={this.props.onCancel}>Cancel</button>
                    <button onClick={this.props.onConfirm}>Confirm</button>
                </div>
            </Modal>
        );
    }
}

NavigationConfirmModal.propTypes = propTypes;
export default NavigationConfirmModal;
