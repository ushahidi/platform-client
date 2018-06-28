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
    RECEIVE_PERSON_FOR_EDITING
} from "./people.actions";
import { HANDLE_REQUEST, HANDLE_SUCCESS, HANDLE_FAILURE } from "react/common/state/globalHandlers/handlers.actions"

const error = {
    error: {
        errorMessage: "error!"
    }
};

const personResponse = {
    id: 5
};
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("People Actions", () => {
    beforeEach(() => {
        moxios.install(instance);
    });

    afterEach(() => {
        moxios.uninstall(instance);
    });

    it("(saveNewUser) creates HANDLE_REQUEST, HANDLE_SUCCESS, and RECEIVE_NEW_PERSON when saving a new person is successful", () => {
        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.respondWith({
                status: 200,
                response: personResponse
            });
        });
        const expectedActions = [
            { 
                type: HANDLE_REQUEST,
                previousAction: {type: SAVE_NEW_PERSON}
            },
            {
                type: HANDLE_SUCCESS,
                previousAction: {type: SAVE_NEW_PERSON}
            },
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

    it("(saveNewPerson) creates HANDLE_REQUEST and HANDLE_FAILURE when saving a person fails", () => {
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
                previousAction: {type: SAVE_NEW_PERSON}
            },
            {
                type: HANDLE_FAILURE,
                previousAction: {type: SAVE_NEW_PERSON},
                error
            }
        ];
        const store = mockStore({ people: [] });
        return store.dispatch(saveNewPerson()).then(() => {
            // return of async actions
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it("(updatePerson) creates HANDLE_REQUEST, HANDLE_SUCCESS, and UPDATE_PERSON_IN_LIST when updating a person successfully", () => {
        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.respondWith({
                status: 200,
                response: personResponse
            });
        });
        const expectedActions = [
            { 
                type: HANDLE_REQUEST,
                previousAction: {type: UPDATE_PERSON}
            },
            {
                type: HANDLE_SUCCESS,
                previousAction: {type: UPDATE_PERSON},
            },
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
    it("(updatePerson) creates HANDLE_REQUEST and HANDLE_FAILURE when updating a person fails", () => {
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
                previousAction: {type: UPDATE_PERSON}
            },
            {
                type: HANDLE_FAILURE,
                previousAction: {type: UPDATE_PERSON},
                error
            }
        ];
        const store = mockStore({ people: [] });
        return store.dispatch(updatePerson()).then(() => {
            // return of async actions
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it("(requestPerson) creates HANDLE_REQUEST, HANDLE_SUCCESS when getting a person record succeeds", () => {
        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.respondWith({
                status: 200,
                response: personResponse
            });
        });
        const expectedActions = [
            { 
                type: HANDLE_REQUEST,
                previousAction: { type: REQUEST_PERSON }
            },
            {
                type: HANDLE_SUCCESS,
                previousAction: { type: REQUEST_PERSON }
            }
        ];
        const store = mockStore({ people: [] });
        return store.dispatch(requestPerson()).then(() => {
            // return of async actions
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
    it("(requestPerson) creates HANDLE_REQUEST and HANDLE_FAILURE when updating a person fails", () => {
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
                previousAction: { type: REQUEST_PERSON },
            },
            {
                type: HANDLE_FAILURE,
                previousAction: { type: REQUEST_PERSON },
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
