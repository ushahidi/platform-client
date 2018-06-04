import React from "react";
import PropTypes from "prop-types";
// import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import connectWithStore from "react/react-transition/connectWithStore";
import * as PeopleActions from "react/common/state/people/people.actions";
import * as RolesActions from "react/common/state/roles/roles.actions";
import {
    isLoadingRoles,
    getRoles
    // getRoleError
} from "react/common/state/roles/roles.reducers";
import { getPeople } from "react/common/state/people/people.reducers";
import PersonForm from "react/settings/people/PersonForm";

const propTypes = {
    PeopleActions: PropTypes.shape({
        saveNewPerson: PropTypes.func.isRequired
    }).isRequired,
    RolesActions: PropTypes.shape({
        requestRoles: PropTypes.func.isRequired
    }).isRequired,
    roles: PropTypes.arrayOf(PropTypes.object).isRequired,
    isLoadingRoles: PropTypes.bool.isRequired
    // error: PropTypes.shape({
    //     message: PropTypes.string
    // }).isRequired
};

class PersonContainer extends React.Component {
    componentDidMount() {
        // Need UI to handle failures for this.
        // Error currently saved to state.error
        this.props.RolesActions.requestRoles();
    }

    render() {
        return (
            <main role="main">
                <div>
                    <h2>Add people to Ushahidi</h2>
                    <p>
                        Add members of your team, beneficiaries, and other
                        members of your community to Ushahidi
                    </p>
                </div>
                <PersonForm
                    saveNewPerson={this.props.PeopleActions.saveNewPerson}
                    roles={this.props.roles}
                    isLoadingRoles={this.props.isLoadingRoles}
                />
            </main>
        );
    }
}

function mapStateToProps(state) {
    return {
        people: getPeople(state),
        roles: getRoles(state),
        isLoadingRoles: isLoadingRoles(state)
        // error: getRoleError(state)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        PeopleActions: bindActionCreators(PeopleActions, dispatch),
        RolesActions: bindActionCreators(RolesActions, dispatch)
    };
}

PersonContainer.propTypes = propTypes;

export { PersonContainer as PlainPersonContainer };

export default connectWithStore(
    PersonContainer,
    mapStateToProps,
    mapDispatchToProps
);
