import deepFreeze from "deep-freeze";
import PeopleReducer from "./people.reducers";
import {
    RECEIVE_NEW_PERSON,
    SAVE_NEW_PERSON,
    HANDLE_REQUEST_FAILURE,
    UPDATE_PERSON_IN_LIST,
    REQUEST_PERSON,
    RECEIVE_PERSON
} from "./people.actions";

const error = {
    errorMessage: "error!"
};

const person = {
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

const initialState = {
    people: [],
    error: {},
    isSaving: false
};
describe("People Reducer: Saving a person", () => {
    test("SAVE_NEW_PERSON returns current state and changes isSaving to true", () => {
        const action = {
            type: SAVE_NEW_PERSON
        };
        const stateAfter = {
            people: [],
            error: {},
            isSaving: true
        };

        const stateBefore = initialState;
        deepFreeze(stateBefore);
        deepFreeze(stateAfter);
        deepFreeze(action);
        expect(PeopleReducer(stateBefore, action)).toEqual(stateAfter);
    });
    test("RECEIVE_NEW_PERSON adds a newly saved person to the people state array ", () => {
        const action = {
            type: RECEIVE_NEW_PERSON,
            person
        };
        const stateAfter = {
            people: [person],
            error: {},
            isSaving: false
        };

        const stateBefore = initialState;
        deepFreeze(stateBefore);
        deepFreeze(stateAfter);
        deepFreeze(action);
        expect(PeopleReducer(stateBefore, action)).toEqual(stateAfter);
    });
    test("HANDLE_REQUEST_FAILURE returns people array unchanged, changes isSaving to false, and adds error", () => {
        const action = {
            type: HANDLE_REQUEST_FAILURE,
            error
        };
        // setting initial state locally so that we can test to ensure
        // the people array returns with existing people
        const localInitialState = {
            people: [person],
            error: {},
            isSaving: false
        };
        const stateAfter = {
            people: [person],
            error,
            isSaving: false
        };

        const stateBefore = localInitialState;
        deepFreeze(stateBefore);
        deepFreeze(stateAfter);
        deepFreeze(action);
        expect(PeopleReducer(stateBefore, action)).toEqual(stateAfter);
    });
    test("UPDATE_PERSON_IN_LIST returns people array with the single person updated and changes isSaving to false", () => {
        const action = {
            type: UPDATE_PERSON_IN_LIST,
            person: { id: 4, name: "Success!" }
        };
        // setting initial state locally so that we can test to ensure
        // the people array returns with existing people
        const localInitialState = {
            people: [person, person, { id: 4, name: "tester" }, person],
            error: {},
            isSaving: true
        };
        const stateAfter = {
            people: [person, person, { id: 4, name: "Success!" }, person],
            error: {},
            isSaving: false
        };

        const stateBefore = localInitialState;
        deepFreeze(stateBefore);
        deepFreeze(stateAfter);
        deepFreeze(action);
        expect(PeopleReducer(stateBefore, action)).toEqual(stateAfter);
    });
    test("REQUEST_PERSON sets isSaving to true ", () => {
        const action = {
            type: REQUEST_PERSON,
        };

        const stateAfter = {
            people: [],
            error: {},
            isSaving: true
        };

        const stateBefore = initialState;
        deepFreeze(stateBefore);
        deepFreeze(stateAfter);
        deepFreeze(action);
        expect(PeopleReducer(stateBefore, action)).toEqual(stateAfter);
    });
    test("REQUEST_PERSON sets isSaving to true ", () => {
        const action = {
            type: RECEIVE_PERSON,
        };
        // setting initial state locally so that we can test to ensure
        // the people array returns with existing people
        const localInitialState = {
            people: [],
            error: {},
            isSaving: true
        };
        const stateAfter = {
            people: [],
            error: {},
            isSaving: false
        };

        const stateBefore = localInitialState;
        deepFreeze(stateBefore);
        deepFreeze(stateAfter);
        deepFreeze(action);
        expect(PeopleReducer(stateBefore, action)).toEqual(stateAfter);
    });
});
