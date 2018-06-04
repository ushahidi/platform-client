import { combineReducers } from "redux";
import forms from "./common/directives/ush-logo-react/ush-logo.reducer";
import people from "./react/common/state/people/people.reducers";
import roles from "./react/common/state/roles/roles.reducers";

// Combine all reducers into one root reducer
export default combineReducers({
    forms,
    people,
    roles
});
