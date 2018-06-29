import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import connectWithStore from "react/react-transition/connectWithStore";
import { Provider } from "react-redux";

// Actions
import * as PeopleActions from "react/common/state/people/people.actions";
import * as RolesActions from "react/common/state/roles/roles.actions";

// Selectors
import { getRoles } from "react/common/state/roles/roles.reducers";
import {
    getPeople,
    getPerson
} from "react/common/state/people/people.reducers";
import {
    getLoadingState,
    getErrors
} from "react/common/state/globalHandlers/handlers.reducers";

// Components
import PersonCreateForm from "react/settings/people/PersonCreateForm";
import PersonEditContainer from "react/settings/people/PersonEditContainer";

const propTypes = {
    PeopleActions: PropTypes.shape({
        saveNewPerson: PropTypes.func.isRequired,
        requestPerson: PropTypes.func.isRequired,
        updatePerson: PropTypes.func.isRequired
    }).isRequired,
    RolesActions: PropTypes.shape({
        requestRoles: PropTypes.func.isRequired
    }).isRequired,
    roles: PropTypes.arrayOf(PropTypes.object).isRequired,
    people: PropTypes.arrayOf(PropTypes.object).isRequired,
    person: PropTypes.shape({
        id: PropTypes.number,
        realname: PropTypes.string,
        role: PropTypes.string,
        email: PropTypes.string
    }),
    isLoading: PropTypes.shape({
        REQUEST_ROLES: PropTypes.bool,
        REQUEST_PERSON: PropTypes.bool
    }).isRequired,
    hasErrors: PropTypes.shape({
        REQUEST_ROLES: PropTypes.bool, // one of
        REQUEST_PERSON: PropTypes.bool // one of
    }).isRequired,
    store: PropTypes.shape({}).isRequired
};

const defaultProps = {
    person: undefined
};

class PersonContainer extends React.Component {
    componentDidMount() {
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
                                    isLoading={this.props.isLoading}
                                    hasErrors={this.props.hasErrors}
                                />
                            )}
                        />
                        <Route
                            path="/settings/users/edit/:id"
                            render={props => (
                                <Provider store={this.props.store}>
                                    <PersonEditContainer
                                        requestPerson={
                                            this.props.PeopleActions
                                                .requestPerson
                                        }
                                        updatePerson={
                                            this.props.PeopleActions
                                                .updatePerson
                                        }
                                        roles={this.props.roles}
                                        person={this.props.person}
                                        hasErrors={this.props.hasErrors}
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
        isLoading: getLoadingState(state),
        person: getPerson(state, ownProps),
        hasErrors: getErrors(state)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        PeopleActions: bindActionCreators(PeopleActions, dispatch),
        RolesActions: bindActionCreators(RolesActions, dispatch)
    };
}

PersonContainer.propTypes = propTypes;
PersonContainer.defaultProps = defaultProps;

export { PersonContainer as DisconnectedPersonContainer };

export default connectWithStore(
    PersonContainer,
    mapStateToProps,
    mapDispatchToProps
);
