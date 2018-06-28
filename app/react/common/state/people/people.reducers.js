import { createReducer } from "redux-create-reducer";
import {
    RECEIVE_NEW_PERSON,
    UPDATE_PERSON_IN_LIST,
    RECEIVE_PERSON_FOR_EDITING
} from "./people.actions";

const initialState = {
    people: [],
};

export default createReducer(initialState, {
    [RECEIVE_NEW_PERSON]: (state, action) => ({
        ...state,
        people: [...state.people, action.person],
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
        };
    }
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