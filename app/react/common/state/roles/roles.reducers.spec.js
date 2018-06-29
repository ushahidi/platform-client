import deepFreeze from "deep-freeze";
import RolesReducer from "./roles.reducers";
import { RECEIVE_ROLES } from "./roles.actions";

// test data
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
    roles: []
};

describe("Roles State", () => {
    test("RECEIVE_ROLES adds roles to roles array", () => {
        const action = {
            type: RECEIVE_ROLES,
            roles: [role]
        };
        const stateAfter = {
            roles: [role]
        };

        const stateBefore = initialState;
        deepFreeze(stateBefore);
        deepFreeze(stateAfter);
        deepFreeze(action);
        expect(RolesReducer(stateBefore, action)).toEqual(stateAfter);
    });

    test("RECEIVE_ROLES adds roles to roles array with existing data already in store", () => {
        const action = {
            type: RECEIVE_ROLES,
            roles: [role]
        };
        const stateAfter = {
            roles: [{ testRole: 1 }, role]
        };

        const stateBefore = {
            roles: [{ testRole: 1 }]
        };
        deepFreeze(stateBefore);
        deepFreeze(stateAfter);
        deepFreeze(action);
        expect(RolesReducer(stateBefore, action)).toEqual(stateAfter);
    });
});
