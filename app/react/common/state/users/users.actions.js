import UserEndpoints from "react/common/endpoints/users";

export const GET_USERS = "GET_USERS";
export const RECEIVE_USERS = "RECEIVE_USERS";
export const HANDLE_REQUEST_FAILURE = "HANDLE_REQUEST_FAILURE";
export const TOGGLE_USER = "TOGGLE_USER";

export function receiveUsers(users) {
    return { type: RECEIVE_USERS, users };
}

export function handleRequestFailure(error) {
    return { type: HANDLE_REQUEST_FAILURE, error };
}

export function requestUsers() {
    return function action(dispatch) {
        dispatch({ type: GET_USERS });
        return UserEndpoints.getUsers()
            .then(usersResponse =>
                dispatch(receiveUsers(usersResponse.results))
            )
            .catch(error => dispatch(handleRequestFailure(error)));
    };
}

export function toggleUser(userId) {
    return function action(dispatch) {
        dispatch({ type: TOGGLE_USER, userId });
    };
}
