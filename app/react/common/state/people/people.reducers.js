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

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SAVE_NEW_PERSON:
            return {
                ...state,
                isSaving: true
            };
        case HANDLE_REQUEST_FAILURE:
            return {
                ...state,
                error: action.error,
                isSaving: false
            };
        case RECEIVE_PERSON:
            return {
                ...state,
                people: [...state.people, action.person],
                isSaving: false
            };
        case RECEIVE_PEOPLE:
            return {
                ...state,
                people: action.people
            };
        default:
            return state;
    }
}

export function getPeople(state) {
    return state.people.people;
}
