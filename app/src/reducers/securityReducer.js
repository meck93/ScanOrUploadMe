// A reducer is a pure function that takes the previous state and an action as arguments and returns a new state. The reducer is instrumental in keeping the current state of calendarId updated throughout our app as it changes.

const INITIAL_STATE = {
    accessToken: null,
    idToken: null,
    refreshToken: null,
    expires_in: null
};

export default securityReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SET_TOKENS':
            // retrieve the access token from the action's payload
            const tokens = action.payload;

            // Return the new state (don't update the old state)
            return Object.assign({}, state, {
                accessToken: tokens.access_token,
                idToken: tokens.id_token,
                refreshToken: tokens.refresh_token,
                expires_in: Date.now() + tokens.expires_in
            });

        case 'CLEAR_TOKENS':
            // remove any existing access token
            // return the new state (don't update the old state)
            return Object.assign({}, state, {
                accessToken: null,
                idToken: null,
                refreshToken: null,
                expires_in: null
            });

        default:
            return state;
    }
};
