export const HANDLE_REQUEST = "HANDLE_REQUEST";
export const HANDLE_FAILURE = "HANDLE_FAILURE";
export const HANDLE_SUCCESS = "HANDLE_SUCCESS";


export function handleRequest(previousAction) {
    return { type: HANDLE_REQUEST, previousAction: previousAction}
}

export function handleSuccess(previousAction, nextAction) {
    return function action(dispatch) {
        dispatch({ type: HANDLE_SUCCESS, previousAction: previousAction });
        if (nextAction) {
            dispatch(nextAction)
        }
        
    };
}

export function handleFailure(previousAction, error) {
    return { type: HANDLE_FAILURE, previousAction: previousAction, error: error}
}