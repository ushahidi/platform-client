import { SAVE_NEW_USER, UPDATE_USERS_STATE } from "./users.actions";

const initialState = {
    users: []
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SAVE_NEW_USER:
            return state;
        case UPDATE_USERS_STATE:
            return {
                ...state,
                users: [...state.users, action.user]
            };
        default:
            return state;
    }
}

export function getUsers(state) {
    return state.users.users;
}