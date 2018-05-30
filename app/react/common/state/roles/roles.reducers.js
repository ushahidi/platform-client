import {
    REQUEST_ROLES,
    RECEIVE_ROLES,
    HANDLE_REQUEST_FAILURE
} from "./roles.actions";

const initialState = {
    roles: [],
    // To Do separate ui from db state
    isLoading: true,
    error: {}
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case REQUEST_ROLES:
            return {
                ...state,
                isLoading: true
            };
        case RECEIVE_ROLES:
            return {
                ...state,
                roles: [...state.roles, ...action.roles],
                isLoading: false
            };
        case HANDLE_REQUEST_FAILURE:
            return {
                // keep existing roles in state if there are any?
                ...state,
                error: action.error,
                isLoading: false
            };
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

export function getRoleError(state) {
    return state.roles.error;
}
