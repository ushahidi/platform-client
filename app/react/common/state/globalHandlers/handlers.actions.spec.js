import expect from "expect";

import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";


import {
    HANDLE_REQUEST,
    HANDLE_FAILURE,
    HANDLE_SUCCESS,
    handleSuccess,
    handleFailure
} from "./handlers.actions";
const TEST_ACTION = "TEST_ACTION"
const REQUEST_TEST ="REQUEST_TEST"
const testAction = (test) => {type: TEST_ACTION, test}

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("Global Handlers Actions", () => {
    it("handleSuccess dispatches its own action and the passed in action", () => {
        const expectedActions = [
            { 
                type: HANDLE_SUCCESS, 
                previousAction: {type: REQUEST_TEST}
            },
            {
                type: TEST_ACTION,
                test: "test"
            }
        ];

        const store = mockStore({ });
        return store.dispatch(handleSuccess({type: REQUEST_TEST}, {type: TEST_ACTION, test: "test"}))
        expect(store.getActions()).toEqual(expectedActions);
    });

    it("handleFailure dispatches its own action", () => {
        const expectedActions = 
            { 
                type: HANDLE_FAILURE,
                error: "error",
                previousAction: {type: REQUEST_TEST} 
            }
        ;

        expect(handleFailure({type: REQUEST_TEST}, "error")).toEqual(expectedActions);
    });
});