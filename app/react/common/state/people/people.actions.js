import PersonEndpoints from "react/common/endpoints/people";

export const SAVE_NEW_PERSON = "SAVE_NEW_PERSON";
export const FETCH_PEOPLE = "FETCH_PEOPLE";
export const RECEIVE_PERSON = "RECEIVE_PERSON";
export const HANDLE_REQUEST_FAILURE = "HANDLE_REQUEST_FAILURE";
export const RECEIVE_PEOPLE = "RECEIVE_PEOPLE";
export function receivePerson(person) {
    return { type: RECEIVE_PERSON, person };
}
export function receivePeople(people) {
    return { type: RECEIVE_PEOPLE, people };
}

export function handleRequestFailure(error) {
    return { type: HANDLE_REQUEST_FAILURE, error };
}

export function saveNewPerson(person) {
    return function action(dispatch) {
        dispatch({ type: SAVE_NEW_PERSON });
        return PersonEndpoints.save(person)
            .then(personResponse => dispatch(receivePerson(personResponse)))
            .catch(error => dispatch(handleRequestFailure(error)));
    };
}

export function fetchPeople(params) {
    return function action(dispatch) {
        dispatch({ type: FETCH_PEOPLE });
        return PersonEndpoints.search(params)
            .then(peopleResponse => dispatch(receivePeople(peopleResponse)))
            .catch(error => dispatch(handleRequestFailure(error)));
    };
}
