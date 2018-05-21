import { SAVE_NEW_USER, RECEIVE_USER } from "./users.actions";

const initialState = {
    users: []
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SAVE_NEW_USER:
            return state;
        case RECEIVE_USER:
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
