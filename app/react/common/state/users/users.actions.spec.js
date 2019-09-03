import instance from "react/common/endpoints/axiosInstance";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import moxios from "moxios";
import expect from "expect";
import { GET_USERS, RECEIVE_USERS, requestUsers } from "./users.actions";

const users = [
    {
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
    }
];

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("Users actions", () => {
    beforeEach(() => {
        moxios.install(instance);
    });

    afterEach(() => {
        moxios.uninstall(instance);
    });

    it("dispatches GET_USERS when request is successful", () => {
        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.respondWith({
                status: 200,
                response: { results: users }
            });
        });

        const expectedActions = [
            { type: GET_USERS },
            { type: RECEIVE_USERS, users }
        ];
        const store = mockStore({ users: [] });
        return store.dispatch(requestUsers()).then(() => {
            // return of async actions
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
});
