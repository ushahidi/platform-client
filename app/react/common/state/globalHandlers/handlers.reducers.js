import { createReducer } from "redux-create-reducer";
import {
    HANDLE_REQUEST,
    HANDLE_FAILURE,
    HANDLE_SUCCESS
} from "./handlers.actions";

const initialState = {
    isLoading: {},
    hasError: {}
};

export default createReducer(initialState, {
    [HANDLE_REQUEST]: (state, action) => ({
        ...state,
        isLoading: { ...state.isLoading, [action.previousAction.type]: true }
    }),
    [HANDLE_SUCCESS]: (state, action) => ({
        ...state,
        isLoading: { ...state.isLoading, [action.previousAction.type]: false },
        hasError: {
            ...state.hasError,
            [action.previousAction.type]: {
                failed: false,
                errorLog: {}
            }
        }
    }),
    [HANDLE_FAILURE]: (state, action) => ({
        ...state,
        isLoading: { ...state.isLoading, [action.previousAction.type]: false },
        hasError: {
            ...state.hasError,
            [action.previousAction.type]: {
                failed: true,
                errorLog: action.error
            }
        }
    })
});

export function getLoadingState(state) {
    return state.handlers.isLoading;
}

export function hasError(state) {
    return state.handlers.hasError;
}

export function getCurrentErrors(state) {
    return Object.keys(state.handlers.hasError).map(key => {
        if (state.handlers.hasError[key].failed) {
            return state.handlers.hasError[key].errorLog.message;
        }
        return null;
    });
}
