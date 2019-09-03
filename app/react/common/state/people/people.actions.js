import PersonEndpoints from "react/common/endpoints/people";
import {
    handleRequest,
    handleSuccess,
    handleFailure
} from "react/common/state/globalHandlers/handlers.actions";

export const SAVE_NEW_PERSON = "SAVE_NEW_PERSON";
export const FETCH_PEOPLE = "FETCH_PEOPLE";
export const RECEIVE_PERSON = "RECEIVE_PERSON";
export const HANDLE_REQUEST_FAILURE = "HANDLE_REQUEST_FAILURE";
export const RECEIVE_PEOPLE = "RECEIVE_PEOPLE";
export const UPDATE_PERSON = "UPDATE_PERSON";
export const REQUEST_PERSON = "REQUEST_PERSON";

export function receivePerson(person) {
    return { type: RECEIVE_PERSON, person };
}
export function receivePeople(people) {
    return { type: RECEIVE_PEOPLE, people };
}

export function saveNewPerson(person) {
    return function action(dispatch) {
        dispatch(handleRequest({ type: SAVE_NEW_PERSON }));
        return PersonEndpoints.save(person)
            .then(personResponse =>
                dispatch(
                    handleSuccess(
                        { type: SAVE_NEW_PERSON },
                        receivePerson(personResponse)
                    )
                )
            )
            .catch(error =>
                dispatch(handleFailure({ type: SAVE_NEW_PERSON }, error))
            );
    };
}

export function updatePerson(person, id) {
    return function action(dispatch) {
        dispatch(handleRequest({ type: UPDATE_PERSON }));
        return PersonEndpoints.update(person, id)
            .then(personResponse =>
                dispatch(
                    handleSuccess(
                        { type: UPDATE_PERSON },
                        receivePerson(personResponse)
                    )
                )
            )
            .catch(error =>
                dispatch(handleFailure({ type: UPDATE_PERSON }, error))
            );
    };
}

export function requestPerson(id) {
    return function action(dispatch) {
        dispatch(handleRequest({ type: REQUEST_PERSON }));
        return PersonEndpoints.get(id)
            .then(personResponse => {
                dispatch(
                    handleSuccess(
                        { type: REQUEST_PERSON },
                        receivePerson(personResponse)
                    )
                );
            })
            .catch(error =>
                dispatch(handleFailure({ type: REQUEST_PERSON }, error))
            );
    };
}

export function fetchPeople(params) {
    return function action(dispatch) {
        dispatch({ type: FETCH_PEOPLE });
        return PersonEndpoints.search(params)
            .then(peopleResponse => dispatch(receivePeople(peopleResponse)))
            .catch(error => dispatch(handleFailure(error)));
    };
}
