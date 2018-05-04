import { combineReducers } from "redux";
import Forms from "./common/directives/ush-logo-react/ush-logo.reducer";

// Combine all reducers into one root reducer
export const RootReducer = combineReducers({
    Forms
});