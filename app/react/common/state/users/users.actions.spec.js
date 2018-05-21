import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import "isomorphic-fetch";
import fetchMock from "fetch-mock";
import { SAVE_NEW_USER, RECEIVE_USER, saveNewUser } from "./users.actions";

const userResponse = {
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

describe("async actions", () => {
    afterEach(() => {
        fetchMock.reset();
        fetchMock.restore();
    });

    it("creates RECEIVE_USER and SAVE_NEW_USER when POST user has been done", () => {
        fetchMock.postOnce("*", userResponse);
        const expectedActions = [
            { type: SAVE_NEW_USER },
            {
                type: RECEIVE_USER,
                user: userResponse
            }
        ];
        const store = mockStore({ users: [] });
        return store.dispatch(saveNewUser()).then(() => {
            // return of async actions
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
});
