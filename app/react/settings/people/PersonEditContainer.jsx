import React from "react";
import PropTypes from "prop-types";
import connectWithStore from "react/react-transition/connectWithStore";

// selectors
import { getLoadingState } from "react/common/state/globalHandlers/handlers.reducers";

// components
import InlineLoading from "react/common/ui/InlineLoading";
import PersonEditForm from "./PersonEditForm";

const propTypes = {
    requestPerson: PropTypes.func.isRequired,
    updatePerson: PropTypes.func.isRequired,
    person: PropTypes.shape({
        id: PropTypes.number,
        realname: PropTypes.string,
        role: PropTypes.string,
        email: PropTypes.string
    }),
    roles: PropTypes.arrayOf(PropTypes.object).isRequired,
    isLoading: PropTypes.shape({
        REQUEST_ROLES: PropTypes.bool,
        REQUEST_PERSON: PropTypes.bool
    }).isRequired,
    hasErrors: PropTypes.shape({
        REQUEST_ROLES: PropTypes.bool, // one of
        REQUEST_PERSON: PropTypes.bool // one of
    }).isRequired,
    match: PropTypes.shape({
        params: PropTypes.shape({
            id: PropTypes.string
        })
    }).isRequired
};

const defaultProps = {
    person: undefined
};

class PersonEditContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            person: {}
        };
    }

    componentDidMount() {
        if (this.props.person === undefined) {
            this.props
                .requestPerson(this.props.match.params.id)
                .then(person => {
                    this.setState({ person });
                });
        }
    }

    render() {
        return (
            <main role="main">
                <div>
                    <h3>Add Contact</h3>
                    <p>
                        Add members of your team, stakeholders, and other
                        members of your community to Ushahidi.
                    </p>
                </div>
                {this.props.isLoading.REQUEST_PERSON ? (
                    <InlineLoading />
                ) : (
                    <PersonEditForm
                        onSubmit={values =>
                            this.props.updatePerson(values, values.id)
                        }
                        initialValues={
                            this.props.person
                                ? this.props.person
                                : this.state.person
                        }
                        roles={this.props.roles}
                        isLoading={this.props.isLoading}
                        hasErrors={this.props.hasErrors}
                    />
                )}
            </main>
        );
    }
}

PersonEditContainer.propTypes = propTypes;
PersonEditContainer.defaultProps = defaultProps;

function mapStateToProps(state) {
    return {
        isLoading: getLoadingState(state)
    };
}

PersonEditContainer.propTypes = propTypes;
PersonEditContainer.defaultProps = defaultProps;

export { PersonEditContainer as DisconnectedPersonEditContainer };

export default connectWithStore(PersonEditContainer, mapStateToProps);
