import PersonEndpoints from "react/common/endpoints/users";

export const SAVE_NEW_PERSON = "SAVE_NEW_PERSON";
export const RECEIVE_PERSON = "RECEIVE_PERSON";
export const HANDLE_REQUEST_FAILURE = "HANDLE_REQUEST_FAILURE";

export function receivePerson(person) {
    return { type: RECEIVE_PERSON, person };
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
