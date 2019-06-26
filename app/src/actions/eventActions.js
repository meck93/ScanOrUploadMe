export const setCurrentEvent = eventId => ({
  type: 'SET_CURRENT_EVENT',
  payload: eventId
});

export const addEvent = event => ({
  type: 'ADD_EVENT',
  payload: event
});

export const modifyEvent = event => ({
  type: 'MODIFY_EVENT',
  payload: event
});

export const deleteEvent = eventId => ({
  type: 'DELETE_EVENT',
  payload: eventId
});
