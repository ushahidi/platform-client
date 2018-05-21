import RolesEndpoints from "react/common/endpoints/roles";

export const REQUEST_ROLES = "REQUEST_ROLES";
export const RECEIVE_ROLES = "RECEVIE_ROLES";

export function receiveRoles(roles) {
    return { type: RECEIVE_ROLES, roles };
}

export function requestRoles() {
    return function action(dispatch) {
        dispatch({ type: REQUEST_ROLES });
        return RolesEndpoints.getRoles().then(rolesResponse =>
            dispatch(receiveRoles(rolesResponse.results))
        );
    };
}
