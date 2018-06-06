import { createReducer } from "redux-create-reducer";
import {
    SAVE_NEW_PERSON,
    RECEIVE_PERSON,
    RECEIVE_PEOPLE,
    HANDLE_REQUEST_FAILURE
} from "./people.actions";

const initialState = {
    people: [],
    error: {},
    isSaving: false
};

export default createReducer(initialState, {
    [SAVE_NEW_PERSON]: state => ({
        ...state,
        isSaving: true
    }),
    [HANDLE_REQUEST_FAILURE]: (state, action) => ({
        ...state,
        error: action.error,
        isSaving: false
    }),
    [RECEIVE_PERSON]: (state, action) => ({
        ...state,
        people: [...state.people, action.person],
        isSaving: false
    }),
    [RECEIVE_PEOPLE]: (state, action) => ({
        ...state,
        people: action.people
    })
});

export function getPeople(state) {
    return state.people.people;
}
