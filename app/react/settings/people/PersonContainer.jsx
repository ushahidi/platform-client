import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import connectWithStore from "react/react-transition/connectWithStore";
import * as PeopleActions from "react/common/state/people/people.actions";
import * as RolesActions from "react/common/state/roles/roles.actions";
import {
    isLoadingRoles,
    getRoles
} from "react/common/state/roles/roles.reducers";
import { getPeople, getPerson } from "react/common/state/people/people.reducers";
import PersonCreateForm from "react/settings/people/PersonCreateForm";
import PersonEditContainer from "react/settings/people/PersonEditContainer";
import { Provider } from "react-redux";


const propTypes = {
    PeopleActions: PropTypes.shape({
        saveNewPerson: PropTypes.func.isRequired,
        requestPerson: PropTypes.func.isRequired
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
    constructor(props) {
        super(props)
    }
    componentDidMount() {
        console.log(this.props.store)
        if (this.props.roles.length === 0) {
            this.props.RolesActions.requestRoles();
        }
    }

    render() {
        return (
            <div>
                <Router>
                    <Switch>
                        <Route
                            exact
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
                        <Route
                            path="/settings/users/edit/:id"
                            render={props => (
                                <Provider store={this.props.store}>
                                <PersonEditContainer
                                    requestPerson={
                                        this.props.PeopleActions.requestPerson
                                    }
                                    updatePerson={
                                        this.props.PeopleActions.updatePerson
                                    }
                                    roles={this.props.roles}
                                    isLoadingRoles={this.props.isLoadingRoles}
                                    person={this.props.person}
                                    // Remove this store after we've fully migrated and are using Provider at root
                                    store={this.props.store}
                                    {...props}
                                />
                                </Provider>
                            )}
                        />
                    </Switch>
                </Router>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        people: getPeople(state),
        roles: getRoles(state),
        isLoadingRoles: isLoadingRoles(state),
        person: getPerson(state, ownProps)
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
