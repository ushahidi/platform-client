import { REQUEST_ROLES, RECEIVE_ROLES } from "./roles.actions";

const initialState = {
    roles: [],
    // To Do separate ui from db state
    isLoading: true
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case REQUEST_ROLES:
            return Object.assign({}, state, {
                isLoading: true
            });
        case RECEIVE_ROLES:
            return Object.assign({}, state, {
                roles: action.roles,
                isLoading: false
            });
        default:
            return state;
    }
}

// selectors
export function isLoadingRoles(state) {
    return state.roles.isLoading;
}

export function getRoles(state) {
    return state.roles.roles;
}
