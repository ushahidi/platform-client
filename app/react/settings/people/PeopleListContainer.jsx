import React from "react";
// import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";

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
import PeopleNavigationContainer from "./PeopleNavigationContainer";
import PeopleToolbarContainer from "./PeopleToolbarContainer";

const propTypes = {
    people: PropTypes.arrayOf(PropTypes.object),
    PeopleActions: PropTypes.shape({
        fetchPeople: PropTypes.func.isRequired
    }).isRequired
};

class PeopleListContainer extends React.Component {
    componentDidMount() {
        this.props.PeopleActions.fetchPeople();
    }
    render() {
        return (
            <div>
                <PeopleNavigationContainer />
                <main role="main">
                    <PeopleToolbarContainer />
                    <div className="main-col">
                        <div className="listing card">
                            <SettingsSearch />
                            <PeopleList people={this.props.people} />
                        </div>
                    </div>
                </main>
            </div>
        );
    }
}

PeopleListContainer.defaultProps = {
    people: []
};

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
PeopleListContainer.defaultProps = {
    people: []
};

PeopleListContainer.propTypes = propTypes;

// specifically for testing
export { PeopleListContainer as DisconnectedPeopleListContainer };

export default connectWithStore(
    PeopleListContainer,
    mapStateToProps,
    mapDispatchToProps
);
