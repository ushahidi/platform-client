import {
    GET_USERS,
    RECEIVE_USERS,
    HANDLE_REQUEST_FAILURE,
    SELECT_USER
} from "./users.actions";

const initialState = {
    users: [],
    error: {},
    isLoading: true,
    selectedUsers: []
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case GET_USERS:
            return {
                ...state,
                isLoading: true
            };
        case RECEIVE_USERS:
            return {
                ...state,
                users: [...action.users],
                isLoading: false
            };
        case HANDLE_REQUEST_FAILURE:
            return {
                // keep existing roles in state if there are any?
                ...state,
                error: action.error,
                isLoading: false
            };
        case SELECT_USER:
            return {
                // keep existing roles in state if there are any?
                ...state,
                selectedUsers: [...state.selectedUsers, ...action.userId]
            };
        default:
            return state;
    }
}

// selectors
export function isLoadingUsers(state) {
    return state.users.isLoading;
}

export function getUsers(state) {
    return state.users.users;
}

export function getUsersError(state) {
    return state.users.error;
}
export function getSelectedUsers(state) {
    return state.users.selectedUsers;
}
