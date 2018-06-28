import PersonEndpoints from "react/common/endpoints/people";
import { handleRequest, handleSuccess, handleFailure } from "react/common/state/globalHandlers/handlers.actions"

export const SAVE_NEW_PERSON = "SAVE_NEW_PERSON";
export const RECEIVE_NEW_PERSON = "RECEIVE_NEW_PERSON";
export const HANDLE_REQUEST_FAILURE = "HANDLE_REQUEST_FAILURE";
export const UPDATE_PERSON = "UPDATE_PERSON";
export const UPDATE_PERSON_IN_LIST = "UPDATE_PERSON_IN_LIST";
export const REQUEST_PERSON = "REQUEST_PERSON";

export function receiveNewPerson(person) {
    return { type: RECEIVE_NEW_PERSON, person };
}

export function saveNewPerson(person) {
    return function action(dispatch) {
        dispatch(handleRequest({ type: SAVE_NEW_PERSON }));
        return PersonEndpoints.save(person)
            .then(personResponse => 
                dispatch(handleSuccess({type: SAVE_NEW_PERSON}, receiveNewPerson(personResponse)))
            )
            .catch(error => dispatch(handleFailure({type: SAVE_NEW_PERSON}, error)))
    };
}

export function updatePersonInList(person) {
    return { type: UPDATE_PERSON_IN_LIST, person };
}

export function updatePerson(person, id) {
    return function action(dispatch) {
        dispatch(handleRequest({ type: UPDATE_PERSON }));
        return PersonEndpoints.update(person, id)
            .then(personResponse =>
                dispatch(handleSuccess({type: UPDATE_PERSON}, updatePersonInList(personResponse)))
            )
            .catch(error => dispatch(handleFailure({type: UPDATE_PERSON}, error)))
    };
}

export function requestPerson(id) {
    return function action(dispatch) {
        dispatch(handleRequest({type: REQUEST_PERSON}))
        return PersonEndpoints.get(id)
            .then((personResponse) => {
                dispatch(handleSuccess({type: REQUEST_PERSON}))
                return personResponse
            })
            .catch(error => dispatch(handleFailure({type: REQUEST_PERSON}, error)))
    };
}
