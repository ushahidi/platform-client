import PersonEndpoints from "react/common/endpoints/people";

export const SAVE_NEW_PERSON = "SAVE_NEW_PERSON";
export const RECEIVE_NEW_PERSON = "RECEIVE_NEW_PERSON";
export const HANDLE_REQUEST_FAILURE = "HANDLE_REQUEST_FAILURE";
export const UPDATE_PERSON = "UPDATE_PERSON";
export const UPDATE_PERSON_IN_LIST = "UPDATE_PERSON_IN_LIST";
export const REQUEST_PERSON = "REQUEST_PERSON";
export const RECEIVE_PERSON = "RECEIVE_PERSON"

export function receiveNewPerson(person) {
    return { type: RECEIVE_NEW_PERSON, person };
}

export function handleRequestFailure(error) {
    return { type: HANDLE_REQUEST_FAILURE, error };
}

export function saveNewPerson(person) {
    return function action(dispatch) {
        dispatch({ type: SAVE_NEW_PERSON });
        return PersonEndpoints.save(person)
            .then(personResponse => dispatch(receiveNewPerson(personResponse)))
            .catch(error => dispatch(handleRequestFailure(error)));
    };
}

export function updatePersonInList(person) {
    return { type: UPDATE_PERSON_IN_LIST, person };
}

export function updatePerson(person, id) {
    return function action(dispatch) {
        dispatch({ type: UPDATE_PERSON });
        return PersonEndpoints.update(person, id)
            .then(personResponse =>
                dispatch(updatePersonInList(personResponse))
            )
            .catch(error => dispatch(handleRequestFailure(error)));
    };
}

export function requestPerson(id) {
    return function action(dispatch) {
        dispatch({ type: REQUEST_PERSON });
        return PersonEndpoints.get(id)
            .then((personResponse) => {
                dispatch({type: RECEIVE_PERSON, personResponse})
            })
            .catch(error => dispatch(handleRequestFailure(error)));
    };
}
