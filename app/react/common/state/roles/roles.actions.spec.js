import instance from "react/common/endpoints/axiosInstance";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import moxios from "moxios";
import expect from "expect";
import {
    HANDLE_REQUEST,
    HANDLE_SUCCESS,
    HANDLE_FAILURE
} from "react/common/state/globalHandlers/handlers.actions";
import { REQUEST_ROLES, RECEIVE_ROLES, requestRoles } from "./roles.actions";

const error = {
    error: {
        errorMessage: "error!"
    }
};

const rolesResponse = {
    results: [1, 2]
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

    it("(requestRoles) creates HANDLE_REQUEST, HANDLE_SUCCESS, and RECEIVE_ROLES when saving a requesting roles is successful", () => {
        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.respondWith({
                status: 200,
                response: rolesResponse
            });
        });
        const expectedActions = [
            {
                type: HANDLE_REQUEST,
                previousAction: { type: REQUEST_ROLES }
            },
            {
                type: HANDLE_SUCCESS,
                previousAction: { type: REQUEST_ROLES }
            },
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

    it("(requestRoles) creates HANDLE_REQUEST and HANDLE_FAILURE when requesting roles fails", () => {
        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.reject({
                status: 401,
                response: error
            });
        });
        const expectedActions = [
            {
                type: HANDLE_REQUEST,
                previousAction: { type: REQUEST_ROLES }
            },
            {
                type: HANDLE_FAILURE,
                previousAction: { type: REQUEST_ROLES },
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
