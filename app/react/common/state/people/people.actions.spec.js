import instance from "react/common/endpoints/axiosInstance";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import moxios from "moxios";
import expect from "expect";
import {
    SAVE_NEW_PERSON,
    RECEIVE_NEW_PERSON,
    HANDLE_REQUEST_FAILURE,
    saveNewPerson,
    updatePerson,
    UPDATE_PERSON,
    UPDATE_PERSON_IN_LIST,
    REQUEST_PERSON,
    requestPerson,
    RECEIVE_PERSON
} from "./people.actions";

const error = {
    error: {
        errorMessage: "error!"
    }
};

const personResponse = {
    id: 5,
    url: "https://carolyntest.api.ushahidi.io/api/v3/users/5",
    email: "testdata@gmail.com",
    realname: "Test Data",
    logins: 0,
    failed_attempts: 0,
    last_login: null,
    last_attempt: null,
    created: "2018-05-16T16:36:24+00:00",
    updated: null,
    role: "user",
    language: null,
    contacts: [],
    allowed_privileges: [
        "read",
        "create",
        "update",
        "delete",
        "search",
        "read_full",
        "register"
    ],
    gravatar: "c1fa5461d96de458f87f6f9e82903587"
};
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("People actions", () => {
    beforeEach(() => {
        moxios.install(instance);
    });

    afterEach(() => {
        moxios.uninstall(instance);
    });

    it("creates RECEIVE_NEW_PERSON and SAVE_NEW_PERSON when POST person has been done", () => {
        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.respondWith({
                status: 200,
                response: personResponse
            });
        });
        const expectedActions = [
            { type: SAVE_NEW_PERSON },
            {
                type: RECEIVE_NEW_PERSON,
                person: personResponse
            }
        ];
        const store = mockStore({ people: [] });
        return store.dispatch(saveNewPerson()).then(() => {
            // return of async actions
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it("creates HANDLE_REQUEST_FAILURE when POST person fails", () => {
        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.reject({
                status: 401,
                response: error
            });
        });
        const expectedActions = [
            { type: SAVE_NEW_PERSON },
            {
                type: HANDLE_REQUEST_FAILURE,
                error
            }
        ];
        const store = mockStore({ people: [] });
        return store.dispatch(saveNewPerson()).then(() => {
            // return of async actions
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it("creates UPDATE_PERSON and UPDATE_PERSON_IN_LIST when updating a person", () => {
        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.respondWith({
                status: 200,
                response: personResponse
            });
        });
        const expectedActions = [
            { type: UPDATE_PERSON },
            {
                type: UPDATE_PERSON_IN_LIST,
                person: personResponse
            }
        ];
        const store = mockStore({ people: [] });
        return store.dispatch(updatePerson()).then(() => {
            // return of async actions
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
    it("creates HANDLE_REQUEST_FAILURE when updating a person fails", () => {
        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.reject({
                status: 401,
                response: error
            });
        });
        const expectedActions = [
            { type: UPDATE_PERSON },
            {
                type: HANDLE_REQUEST_FAILURE,
                error
            }
        ];
        const store = mockStore({ people: [] });
        return store.dispatch(updatePerson()).then(() => {
            // return of async actions
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it("creates REQUEST_PERSON and RECEIVE_PERSON when getting a person record", () => {
        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.respondWith({
                status: 200,
                response: personResponse
            });
        });
        const expectedActions = [
            { type: REQUEST_PERSON },
            { type: RECEIVE_PERSON }
        ];
        const store = mockStore({ people: [] });
        return store.dispatch(requestPerson()).then(() => {
            // return of async actions
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
    it("creates HANDLE_REQUEST_FAILURE when updating a person fails", () => {
        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.reject({
                status: 401,
                response: error
            });
        });
        const expectedActions = [
            { type: REQUEST_PERSON },
            {
                type: HANDLE_REQUEST_FAILURE,
                error
            }
        ];
        const store = mockStore({ people: [] });
        return store.dispatch(requestPerson()).then(() => {
            // return of async actions
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
});
