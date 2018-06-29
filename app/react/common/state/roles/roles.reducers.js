import { createReducer } from "redux-create-reducer";

import { RECEIVE_ROLES } from "./roles.actions";

const initialState = {
    roles: []
};

export default createReducer(initialState, {
    [RECEIVE_ROLES]: (state, action) => ({
        ...state,
        roles: [...state.roles, ...action.roles]
    })
});

export function getRoles(state) {
    return state.roles.roles;
}
