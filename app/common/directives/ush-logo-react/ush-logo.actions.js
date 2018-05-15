import formEndpoint from '../../services/endpoints/form';

export const FETCH_FORMS = 'FETCH_FORMS';
export const RECEIVE_FORMS = 'RECEIVE_FORMS';

export function receiveForms(data) {
    return { type: RECEIVE_FORMS, forms: data };
}

export function fetchForms() {
    return (dispatch) =>
        formEndpoint.query()
            .then(formsArray => dispatch(receiveForms(formsArray)));
}
