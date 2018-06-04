import React from "react";
// import PropTypes from "prop-types";
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
import SettingsSearch from "react/settings/common/SettingsSearch";
import PeopleList from "./PeopleList";

// const propTypes = {};

class PeopleListContainer extends React.Component {
    render() {
        return (
            <div>
                <button>Add a person</button>
                <SettingsSearch />
                <PeopleList />
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

// PeopleListContainer.propTypes = propTypes;

// specifically for testing
export { PeopleListContainer as DisconnectedPeopleListContainer };

export default connectWithStore(
    PeopleListContainer,
    mapStateToProps,
    mapDispatchToProps
);
