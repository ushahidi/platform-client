import { createReducer } from "redux-create-reducer";

import { RECEIVE_ROLES } from "./roles.actions";

const initialState = {
    roles: {}
};
export default createReducer(initialState, {
    [RECEIVE_ROLES]: (state, action) => ({
        ...state,
        roles: action.roles.reduce(
            (result, item) => {
                // linter won't let us reassign parameters
                const resultCopy = result;
                resultCopy[item.id] = item;
                return resultCopy;
            },
            { ...state.roles }
        )
    })
});

export function getRoles(state) {
    return Object.keys(state.roles.roles).map(id => state.roles.roles[id]);
}
