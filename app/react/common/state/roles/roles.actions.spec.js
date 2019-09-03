import instance from "react/common/endpoints/axiosInstance";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import moxios from "moxios";
import expect from "expect";
import {
    REQUEST_ROLES,
    RECEIVE_ROLES,
    HANDLE_REQUEST_FAILURE,
    requestRoles
} from "./roles.actions";

const error = {
    error: {
        errorMessage: "error!"
    }
};

const rolesResponse = {
    results: [
        {
            id: 1,
            url: "http://192.168.33.110/api/v3/roles/1",
            name: "admin",
            display_name: "Admin",
            description: "Administrator",
            permissions: [],
            protected: true,
            allowed_privileges: ["read", "create", "update", "search"]
        }
    ]
};

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("Role actions", () => {
    beforeEach(() => {
        moxios.install(instance);
    });

    afterEach(() => {
        moxios.uninstall(instance);
    });

    it("dispatches REQUEST_ROLES and RECEIVE_ROLES when request is successful", () => {
        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.respondWith({
                status: 200,
                response: rolesResponse
            });
        });
        const expectedActions = [
            { type: REQUEST_ROLES },
            {
                type: RECEIVE_ROLES,
                roles: rolesResponse.results
            }
        ];
        const store = mockStore({ people: [] });
        return store.dispatch(requestRoles()).then(() => {
            // return of async actions
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it("creates HANDLE_REQUEST_FAILURE when GETting a role fails", () => {
        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.reject({
                status: 401,
                response: error
            });
        });
        const expectedActions = [
            { type: REQUEST_ROLES },
            {
                type: HANDLE_REQUEST_FAILURE,
                error
            }
        ];
        const store = mockStore({ people: [] });
        return store.dispatch(requestRoles()).then(() => {
            // return of async actions
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
});
