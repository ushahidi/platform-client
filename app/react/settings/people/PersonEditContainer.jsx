import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import InlineLoading from "react/common/ui/InlineLoading";
import { Field, reduxForm } from 'redux-form'
import connectWithStore from "react/react-transition/connectWithStore";
import { getEditing } from "react/common/state/people/people.reducers"
import PersonEditForm from "./PersonEditForm";

const propTypes = {
    person: PropTypes.shape({
        id: PropTypes.number
    }),
    updatePerson: PropTypes.func.isRequired,
    roles: PropTypes.arrayOf(PropTypes.object).isRequired,
    isLoadingRoles: PropTypes.bool.isRequired,
    requestPerson: PropTypes.func.isRequired
    // error: PropTypes.shape({
    //     message: PropTypes.string
    // }).isRequired
};

const defaultProps = {
    person: undefined
};

class PersonEditContainer extends React.Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        // Need UI to handle failures for this.
        // Error currently saved to state.error

        if (this.props.person === undefined) {
            // if the ID doesn't match the URL params
            this.props.requestPerson(this.props.match.params.id)
                
        }
    }

    handleSubmit(e, values) {
        e.preventDefault()
        alert(values);
        console.log(values)
        // after success, clear state
        // after failure, state remains
        // TBD after we figure out endpoints
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
                <PersonEditForm 
                    onSubmit={(values) => this.props.updatePerson(values)} 
                    initialValues={this.props.initialValues} 
                    roles={this.props.roles} 
                    isLoadingRoles={this.props.isLoadingRoles} 
                />
            </main>
        );
    }
}

PersonEditContainer.propTypes = propTypes;
PersonEditContainer.defaultProps = defaultProps;

function mapStateToProps(state, ownProps) {
      return {
        initialValues: getEditing(state)
    }
}

PersonEditContainer.propTypes = propTypes;
PersonEditContainer.defaultProps = defaultProps;

export default connectWithStore(PersonEditContainer, mapStateToProps)

