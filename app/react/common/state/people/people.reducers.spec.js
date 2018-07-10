import deepFreeze from "deep-freeze";
import PeopleReducer, { getPeople, getPerson } from "./people.reducers";
import {
    RECEIVE_NEW_PERSON,
    UPDATE_PERSON_IN_LIST,
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
    people: {}
};
describe("People Reducers", () => {
    test("RECEIVE_NEW_PERSON adds a newly saved person to the people state array ", () => {
        const action = {
            type: RECEIVE_NEW_PERSON,
            person
        };
        const stateAfter = {
            people: {5: person}
    
        };

        const stateBefore = initialState;
        deepFreeze(stateBefore);
        deepFreeze(stateAfter);
        deepFreeze(action);
        expect(PeopleReducer(stateBefore, action)).toEqual(stateAfter);
    });
    test("UPDATE_PERSON_IN_LIST returns people array with the single person updated", () => {
        const action = {
            type: UPDATE_PERSON_IN_LIST,
            person: { id: 4, name: "Success!" }
        };
        // setting initial state locally so that we can test to ensure
        // the people array returns with existing people
        const localInitialState = {
            people: {
                5: person, 
                4: { id: 4, name: "tester" }, 
                3: person
            }
        };
        const stateAfter = {
            people: {
                5: person, 
                4: { id: 4, name: "Success!" }, 
                3: person
            }
        };

        const stateBefore = localInitialState;
        deepFreeze(stateBefore);
        deepFreeze(stateAfter);
        deepFreeze(action);
        expect(PeopleReducer(stateBefore, action)).toEqual(stateAfter);
    });
    test("getPeople returns people array of people", () => {
        const fakeState = {
            people: {
                people: {
                    1: {id: 1},
                    2: {id: 2},
                    3: {id: 3}
                }
            }
        };

        const expected = [{id:1}, {id:2}, {id:3}];

        expect(getPeople(fakeState)).toEqual(expected);
    });
    test("getPerson return a person object based on the passed in ID", () => {
        const fakeState = {
            people: {
                people: {
                    1: {id: 1},
                    2: {id: 2},
                    3: {id: 3}
                }
            }
        };

        const expected = {id:1};

        expect(getPerson(fakeState, {id: 1})).toEqual(expected);
    });
    
});
