import deepFreeze from "deep-freeze";
import UsersReducer from "./roles.reducers";
import {
    REQUEST_ROLES,
    RECEIVE_ROLES,
    HANDLE_REQUEST_FAILURE
} from "./roles.actions";

const role = {
    id: 1,
    url: "http://192.168.33.110/api/v3/roles/1",
    name: "admin",
    display_name: "Admin",
    description: "Administrator",
    permissions: [],
    protected: true,
    allowed_privileges: ["read", "create", "update", "search"]
};
const initialState = {
    roles: [],
    isLoading: true,
    error: {}
};
describe("Roles State", () => {
    test("REQUEST ROLES sets isLoading to true", () => {
        const action = {
            type: REQUEST_ROLES
        };
        const stateAfter = {
            roles: [],
            isLoading: true,
            error: {}
        };

        const stateBefore = initialState;
        deepFreeze(stateBefore);
        deepFreeze(stateAfter);
        deepFreeze(action);
        expect(UsersReducer(stateBefore, action)).toEqual(stateAfter);
    });

    test("RECEIVE_ROLES adds roles to roles array", () => {
        const action = {
            type: RECEIVE_ROLES,
            roles: [role]
        };
        const stateAfter = {
            roles: [role],
            isLoading: false,
            error: {}
        };

        const stateBefore = initialState;
        deepFreeze(stateBefore);
        deepFreeze(stateAfter);
        deepFreeze(action);
        expect(UsersReducer(stateBefore, action)).toEqual(stateAfter);
    });

    test("RECEIVE_ROLES adds roles to roles array with existing data already in store", () => {
        const action = {
            type: RECEIVE_ROLES,
            roles: [role]
        };
        const stateAfter = {
            roles: [{ testRole: 1 }, role],
            isLoading: false,
            error: {}
        };

        const stateBefore = {
            roles: [{ testRole: 1 }],
            isLoading: true,
            error: {}
        };
        deepFreeze(stateBefore);
        deepFreeze(stateAfter);
        deepFreeze(action);
        expect(UsersReducer(stateBefore, action)).toEqual(stateAfter);
    });

    test("HANDLE_REQUEST_FAILURE adds roles to roles array with existing data already in store", () => {
        const action = {
            type: HANDLE_REQUEST_FAILURE,
            error: { message: "EVERYTHING WENT WRONG!!!!" }
        };
        const stateAfter = {
            roles: [],
            isLoading: false,
            error: { message: "EVERYTHING WENT WRONG!!!!" }
        };

        const stateBefore = initialState;
        deepFreeze(stateBefore);
        deepFreeze(stateAfter);
        deepFreeze(action);
        expect(UsersReducer(stateBefore, action)).toEqual(stateAfter);
    });
});
