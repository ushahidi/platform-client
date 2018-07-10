import React from "react";
import PropTypes from "prop-types";

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
    hasError: PropTypes.shape({
        REQUEST_ROLES: PropTypes.shape({
            failed: PropTypes.bool,
            errorLog: PropTypes.object
        }),
        REQUEST_PERSON: PropTypes.shape({
            failed: PropTypes.bool,
            errorLog: PropTypes.object
        })
    }).isRequired,
    isLoading: PropTypes.shape({
        REQUEST_ROLES: PropTypes.bool,
        REQUEST_PERSON: PropTypes.bool
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
    componentDidMount() {
        if (this.props.person === undefined) {
            this.props.requestPerson(this.props.match.params.id);
        }
    }

    // componentWillUnmount() {
    // cancel request
    // }

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
                        initialValues={this.props.person}
                        roles={this.props.roles}
                        isLoading={this.props.isLoading}
                        hasError={this.props.hasError}
                    />
                )}
            </main>
        );
    }
}

PersonEditContainer.propTypes = propTypes;
PersonEditContainer.defaultProps = defaultProps;

export default PersonEditContainer;
