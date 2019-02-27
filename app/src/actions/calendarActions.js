// Actions are JavaScript objects that represent payloads of information that send data from your application to your Redux store.
// Actions have a type and an optional payload. In our case, the type will be SET_DEFAULT_CALENDAR, and the payload will be the ID of the calendar we want to use as the default calendar.
export const setDefaultCalendar = calendarId => ({
  type: "SET_DEFAULT_CALENDAR",
  payload: calendarId
});

export const setCurrentEvent = eventId => ({
  type: "SET_CURRENT_EVENT",
  payload: eventId
});

export const addEvent = event => ({
  type: "ADD_EVENT",
  payload: event
});

export const deleteEvent = eventId => ({
  type: "DELETE_EVENT",
  payload: eventId
});
