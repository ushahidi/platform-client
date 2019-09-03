import { combineReducers } from "redux";
import { reducer as formReducer } from 'redux-form'
import forms from "./common/directives/ush-logo-react/ush-logo.reducer";
import people from "./react/common/state/people/people.reducers";
import roles from "./react/common/state/roles/roles.reducers";
import users from "./react/common/state/users/users.reducers";
import handlers from "react/common/state/globalHandlers/handlers.reducers";

// Combine all reducers into one root reducer
export default combineReducers({
    form: formReducer,
    forms,
    people,
    roles,
    users,
    handlers
});
