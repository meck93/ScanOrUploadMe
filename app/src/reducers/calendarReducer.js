// A reducer is a pure function that takes the previous state and an action as arguments and returns a new state. The reducer is instrumental in keeping the current state of calendarId updated throughout our app as it changes.

import { combineReducers } from "redux";

const INITIAL_STATE = {
  defaultId: "1",
  currentId: ""
};

const calendarReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "SET_DEFAULT_CALENDAR":
      // Retrieves the current default calendarId
      let { defaultId, currentId } = state;

      // retrieve the calendarId from the action payload
      const calendarId = action.payload;

      // set the new calendarId
      currentId = calendarId;

      // Update the redux state
      const newState = { currentId, defaultId };
      return newState;

    default:
      return state;
  }
};

export default combineReducers({
  calendar: calendarReducer
});
