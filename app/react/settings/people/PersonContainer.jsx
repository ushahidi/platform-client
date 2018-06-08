import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import connectWithStore from "react/react-transition/connectWithStore";
import * as PeopleActions from "react/common/state/people/people.actions";
import * as RolesActions from "react/common/state/roles/roles.actions";
import {
    isLoadingRoles,
    getRoles
} from "react/common/state/roles/roles.reducers";
import { getPeople } from "react/common/state/people/people.reducers";
import PersonCreateForm from "react/settings/people/PersonCreateForm";

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

        if (this.props.roles.length === 0) {
            this.props.RolesActions.requestRoles();
        }
    }

    render() {
        return (
            <div>
                <Router>
                    <div>
                        <Route
                            path="/settings/users/create"
                            render={() => (
                                <PersonCreateForm
                                    saveNewPerson={
                                        this.props.PeopleActions.saveNewPerson
                                    }
                                    roles={this.props.roles}
                                    isLoadingRoles={this.props.isLoadingRoles}
                                />
                            )}
                        />
                    </div>
                </Router>
            </div>
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

export { PersonContainer as DisconnectedPersonContainer };

export default connectWithStore(
    PersonContainer,
    mapStateToProps,
    mapDispatchToProps
);
