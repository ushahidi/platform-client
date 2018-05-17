import UserEndpoints from "react/common/endpoints/users";

export const SAVE_NEW_USER = "SAVE_NEW_USER";
export const UPDATE_USERS_STATE = "UPDATE_USERS_STATE";

export function updateUsersState(user) {
    return { type: UPDATE_USERS_STATE, user };
}

export function saveNewUser(user) {
    return function action(dispatch) {
        dispatch({ type: SAVE_NEW_USER });
        return UserEndpoints.saveUser(user).then(userResponse =>
            dispatch(updateUsersState(userResponse))
        );
    };
}
