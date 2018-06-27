import React from "react";
// import PropTypes from "prop-types";
import * as PeopleActions from "react/common/state/people/people.actions";
import * as RolesActions from "react/common/state/roles/roles.actions";

import { bindActionCreators } from "redux";
import PropTypes from "prop-types";
import connectWithStore from "react/react-transition/connectWithStore";
import { BrowserRouter } from "react-router-dom";

import {
    isLoadingRoles,
    getRoles
    // getRoleError
} from "react/common/state/roles/roles.reducers";
import { getPeople } from "react/common/state/people/people.reducers";
import ListItem from "../../../../component-library/components/molecules/listitem/listitem";
import Button from "../../../../component-library/components/atoms/button/button";

import Breadcrumbs from "../../../../component-library/components/molecules/breadcrumbs/breadcrumbs";
import PeopleList from "./PeopleList";
import SettingsSearch from "../common/SettingsSearch";

const propTypes = {
    people: PropTypes.arrayOf(PropTypes.object),
    PeopleActions: PropTypes.shape({
        fetchPeople: PropTypes.func.isRequired
    }).isRequired
};
const defaultProps = {
    people: []
};

class PeopleListContainer extends React.Component {
    componentDidMount() {
        this.props.PeopleActions.fetchPeople({ orderby: "realname" });
    }

    render() {
        return (
            <BrowserRouter>
                <main role="main">
                    <div className="full-col">
                        <Breadcrumbs
                            navigation={[
                                { path: "/", name: "", key: 0 },
                                { path: "/settings", name: "Settings", key: 1 },
                                {
                                    path: "/settings/people",
                                    name: "People",
                                    key: 2
                                }
                            ]}
                        />
                        <ListItem>
                            <h3>Add People to Ushahidi</h3>
                            <p>
                                Add members of your team, beneficiaries, and
                                other members or your community to Ushahidi.
                            </p>
                            <Button>Add People</Button>
                        </ListItem>
                        <SettingsSearch />
                        <PeopleList people={this.props.people} />
                    </div>
                </main>
            </BrowserRouter>
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

PeopleListContainer.propTypes = propTypes;
PeopleListContainer.defaultProps = defaultProps;
// specifically for testing
export { PeopleListContainer as DisconnectedPeopleListContainer };

export default connectWithStore(
    PeopleListContainer,
    mapStateToProps,
    mapDispatchToProps
);
