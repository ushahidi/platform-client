import { RECEIVE_FORMS } from './ush-logo.reducer';

const initialState = {
    forms: [
        { id: 'junk' }
    ]
};

export default function ushLogoReducer(state = initialState, action) {
    switch (action.type) {
    case RECEIVE_FORMS:
        return Object.assign({}, state, {
            forms: action.forms,
        });
    default:
        return state;
    }
}

export const getFormsFromState = state => state.forms.forms;
