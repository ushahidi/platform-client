import React from "react";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";

import connectWithStore from "react/react-transition/connectWithStore";

import { getCurrentErrors } from "react/common/state/globalHandlers/handlers.reducers";

const propTypes = {
    currentErrors: PropTypes.arrayOf(PropTypes.string)
};

const defaultProps = {
    currentErrors: []
};

const FourZeroFour = props => {
    const renderErrors = errorsArray => (
        <div>{errorsArray.map(error => <p key={uuidv4()}>{error}</p>)}</div>
    );

    return (
        <main role="main">
            <div className="main-col">
                <h1 className="panel-title">Whoops!</h1>
                <p>404</p>
                {props.currentErrors.length
                    ? renderErrors(props.currentErrors)
                    : null}
            </div>
        </main>
    );
};

function mapStateToProps(state) {
    return {
        currentErrors: getCurrentErrors(state)
    };
}

FourZeroFour.propTypes = propTypes;
FourZeroFour.defaultProps = defaultProps;

export { FourZeroFour as DisconnectedFourZeroFour };

export default connectWithStore(FourZeroFour, mapStateToProps);
