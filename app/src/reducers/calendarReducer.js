// A reducer is a pure function that takes the previous state and an action as arguments and returns a new state. The reducer is instrumental in keeping the current state of calendarId updated throughout our app as it changes.

import { combineReducers } from "redux";

const INITIAL_STATE = {
  activeCalendarId: null,
  currentEventId: null,
  currentEvent: null,
  events: []
};

const calendarReducer = (state = INITIAL_STATE, action) => {
  const { events } = state;
  switch (action.type) {
    case "SET_DEFAULT_CALENDAR":
      // retrieve the calendarId from the action payload
      const calendarId = action.payload;

      // Return the new state (don't update the old state)
      return Object.assign({}, state, {
        activeCalendarId: calendarId
      });

    case "SET_CURRENT_EVENT":
      // retrieve the eventId from the action payload
      const eventId = action.payload;

      // select the event for which the ID matches
      const [currentEvent] = events.filter(event => event.id === eventId);

      // Return the new state (don't update the old state)
      return Object.assign({}, state, {
        currentEvent: currentEvent,
        currentEventId: eventId
      });

    case "ADD_EVENT":
      // retrieve the eventId from the action payload
      const event = action.payload;

      // add the event to the list of events
      const newEvents = [...events, ...[event]];

      // Return the new state (don't update the old state)
      return Object.assign({}, state, {
        events: newEvents
      });

    default:
      return state;
  }
};

export default combineReducers({
  calendar: calendarReducer
});
