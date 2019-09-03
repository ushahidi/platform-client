import RolesEndpoints from "react/common/endpoints/roles";
import { handleRequest, handleSuccess, handleFailure } from "../globalHandlers/handlers.actions"

export const REQUEST_ROLES = "REQUEST_ROLES";
export const RECEIVE_ROLES = "RECEIVE_ROLES";

export function receiveRoles(roles) {
    return { type: RECEIVE_ROLES, roles };
}

export function requestRoles() {
    return function action(dispatch) {
        dispatch(handleRequest({ type: REQUEST_ROLES }));
        return RolesEndpoints.getRoles()
            .then(rolesResponse =>
                dispatch(handleSuccess({ type: REQUEST_ROLES }, receiveRoles(rolesResponse.results)))
            )
            .catch(error => dispatch(handleFailure({ type: REQUEST_ROLES }, error)));
    };
}
