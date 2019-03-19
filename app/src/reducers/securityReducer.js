// A reducer is a pure function that takes the previous state and an action as arguments and returns a new state. The reducer is instrumental in keeping the current state of calendarId updated throughout our app as it changes.

const INITIAL_STATE = {
  accessToken: null
};

export default (securityReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "SET_ACCESS_TOKEN":
      // retrieve the access token from the action's payload
      const token = action.payload;

      // Return the new state (don't update the old state)
      return Object.assign({}, state, {
        accessToken: token
      });

    case "CLEAR_ACCESS_TOKEN":
      // remove any existing access token
      // return the new state (don't update the old state)
      return Object.assign({}, state, { accessToken: null });

    default:
      return state;
  }
});
