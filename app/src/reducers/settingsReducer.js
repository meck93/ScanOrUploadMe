// A reducer is a pure function that takes the previous state and an action as arguments and returns a new state. The reducer is instrumental in keeping the current state of calendarId updated throughout our app as it changes.

const INITIAL_SETTINGS_STATE = {
    scanLanguage: 'EN'
};

export default settingsReducer = (state = INITIAL_SETTINGS_STATE, action) => {
    switch (action.type) {
        case 'SET_DEFAULT_SCAN_LANGUAGE':
            // retrieve the calendarId from the action payload
            const scanLanguage = action.payload;

            // Return the new state (don't update the old state)
            return Object.assign({}, state, {
                scanLanguage: scanLanguage
            });

        default:
            return state;
    }
};
