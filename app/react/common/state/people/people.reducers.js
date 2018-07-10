import { createReducer } from "redux-create-reducer";
import {
    RECEIVE_NEW_PERSON,
    UPDATE_PERSON_IN_LIST,
    RECEIVE_PERSON_FOR_EDITING
} from "./people.actions";

const initialState = {
    people: {},
};

export default createReducer(initialState, {
    [RECEIVE_NEW_PERSON]: (state, action) => ({
        ...state,
        people: {...state.people, [action.person.id]: action.person},
    }),
    [UPDATE_PERSON_IN_LIST]: (state, action) => ({
        ...state,
        people: {...state.people, [action.person.id]: action.person}
    })
});

export function getPeople(state) {
    return Object.keys(state.people.people).map(id => state.people.people[id])
}

export function getPerson(state, props) {
    // @TODO: once we have react router set up to connect to personContainer, 
    // then we need to access id from props.match.params.id
    return state.people.people[props.id];
}