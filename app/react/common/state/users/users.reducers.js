import {
    GET_USERS,
    RECEIVE_USERS,
    HANDLE_REQUEST_FAILURE,
    TOGGLE_USER,
    TOGGLE_ALL
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
        case TOGGLE_USER: {
            const userId = action.userId.toString();
            // checking if the user is already selected
            const index = state.selectedUsers.indexOf(userId);
            let newstate;
            if (index !== -1) {
                // if the user is selected, we remove the user from the state
                newstate = [
                    ...state.selectedUsers.slice(0, index),
                    ...state.selectedUsers.slice(index + 1)
                ];
            } else {
                // if the user is not selected, we add it to the state
                newstate = [...state.selectedUsers, userId];
            }
            return {
                ...state,
                selectedUsers: newstate
            };
        }
        case TOGGLE_ALL: {
            let newstate;
            if (action.selectAll) {
                newstate = state.users.map(user => (
                    user.id
                ))
            }
                else {
                    newstate = [];
                }
                console.log(newstate);

                // return newState;
                
            
            // const userId = action.userId.toString();
            // // checking if the user is already selected
            // const index = state.selectedUsers.indexOf(userId);
            //  {
            //     // if the user is not selected, we add it to the state
            //     newstate = [...state.selectedUsers, userId];
            // }
            return {
                ...state,
                selectedUsers: newstate
            };
        }
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

