// A reducer is a pure function that takes the previous state and an action as arguments and returns a new state. The reducer is instrumental in keeping the current state of calendarId updated throughout our app as it changes.

const INITIAL_STATE = {
    activeCalendarId: null
};

export default calendarReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SET_DEFAULT_CALENDAR':
            // retrieve the calendarId from the action payload
            const calendarId = action.payload;

            // Return the new state (don't update the old state)
            return Object.assign({}, state, {
                activeCalendarId: calendarId
            });

        default:
            return state;
    }
};
