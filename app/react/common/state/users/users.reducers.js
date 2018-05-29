import {
    SAVE_NEW_USER,
    RECEIVE_USER,
    HANDLE_REQUEST_FAILURE
} from "./users.actions";

const initialState = {
    users: [],
    error: {},
    isSaving: false
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SAVE_NEW_USER:
            return {
                ...state,
                isSaving: true
            };
        case HANDLE_REQUEST_FAILURE:
            return {
                ...state,
                error: action.error,
                isSaving: false
            };
        case RECEIVE_USER:
            return {
                ...state,
                users: [...state.users, action.user],
                isSaving: false
            };
        default:
            return state;
    }
}

export function getUsers(state) {
    return state.users.users;
}
