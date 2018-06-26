import { createReducer } from "redux-create-reducer";
import {
    SAVE_NEW_PERSON,
    RECEIVE_NEW_PERSON,
    HANDLE_REQUEST_FAILURE,
    UPDATE_PERSON,
    UPDATE_PERSON_IN_LIST,
    REQUEST_PERSON,
    RECEIVE_PERSON
} from "./people.actions";

const initialState = {
    people: [],
    error: {},
    isSaving: false,
    editing: {}
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
    [RECEIVE_NEW_PERSON]: (state, action) => ({
        ...state,
        people: [...state.people, action.person],
        isSaving: false
    }),
    [UPDATE_PERSON]: state => ({
        ...state,
        isSaving: true
    }),
    [UPDATE_PERSON_IN_LIST]: (state, action) => {
        const index = state.people.findIndex(
            person => person.id === action.person.id
        );
        return {
            ...state,
            people: [
                ...state.people.slice(0, index),
                action.person,
                ...state.people.slice(index + 1, state.people.length)
            ],
            isSaving: false
        };
    },
    [REQUEST_PERSON]: state => ({
        ...state,
        isSaving: true
    }),
    [RECEIVE_PERSON]: (state, action) => ({
        ...state,
        editing: action.personResponse,
        isSaving: false
    })
});

export function getPeople(state) {
    return state.people.people;
}

export function getPerson(state, props) {
    // @TODO: once we have react router set up to connect to personContainer, 
    // then we need to access id from props.match.params.id
    if (state.people.people.length) {
        state.people.people.find((person) => {
            return person.id === props.id
        })
    }
}

export function getEditing(state) {
    return state.people.editing
}