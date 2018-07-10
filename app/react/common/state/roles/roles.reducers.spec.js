import deepFreeze from "deep-freeze";
import RolesReducer, { getRoles } from "./roles.reducers";
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
    roles: {}
};

describe("Roles State", () => {
    test("RECEIVE_ROLES adds roles to roles array", () => {
        const action = {
            type: RECEIVE_ROLES,
            roles: [role]
        };
        const stateAfter = {
            roles: { 1: role }
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
            roles: { 2: { testRole: 2 }, 1: role }
        };

        const stateBefore = {
            roles: { 2: { testRole: 2 } }
        };
        deepFreeze(stateBefore);
        deepFreeze(stateAfter);
        deepFreeze(action);
        expect(RolesReducer(stateBefore, action)).toEqual(stateAfter);
    });
});

describe("Roles Selectors", () => {
    test("getRoles returns an array of roles", () => {
        const fakeState = {
            roles: {
                roles: {
                    1: { id: 1 },
                    2: { id: 2 },
                    3: { id: 3 }
                }
            }
        };

        const expected = [{ id: 1 }, { id: 2 }, { id: 3 }];

        expect(getRoles(fakeState)).toEqual(expected);
    });
});
