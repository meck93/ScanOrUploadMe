// A reducer is a pure function that takes the previous state and an action as arguments and returns a new state. The reducer is instrumental in keeping the current state of calendarId updated throughout our app as it changes.

const INITIAL_STATE = {
  currentEventId: null,
  currentEvent: null,
  events: []
};

export default (eventReducer = (state = INITIAL_STATE, action) => {
  const { events } = state;
  switch (action.type) {
    case "SET_CURRENT_EVENT":
      // retrieve the eventId from the action payload
      const eventId = action.payload;

      // select the event for which the ID matches
      const [currentEvent] = events.filter(event => event.id === eventId);

      // return the new state (don't update the old state)
      return Object.assign({}, state, {
        currentEvent: currentEvent,
        currentEventId: eventId
      });

    case "ADD_EVENT":
      // retrieve the event from the action payload
      const event = action.payload;

      // add the event to the list of events
      const newEvents = [...events, ...[event]];

      // return the new state (don't update the old state)
      return Object.assign({}, state, {
        events: newEvents
      });

    case "MODIFY_EVENT":
      // retrieve the event from the action payload
      const newEvent = action.payload;

      // extract all events that don't have the same ID as the current event
      let otherEvents = events.filter(event => event.id !== newEvent.id);

      // create list using the newEvent
      otherEvents = [...otherEvents, ...[newEvent]];

      // return the new state (don't update the old state)
      return Object.assign({}, state, {
        events: otherEvents
      });

    case "DELETE_EVENT":
      // retrieve the eventId from the action payload
      const toBeDeletedId = action.payload;

      // extract all events that don't have the same ID as the to be deleted event
      let remainingEvents = events.filter(event => event.id !== toBeDeletedId);

      // reset the current event if it was deleted
      if (state.currentEventId === toBeDeletedId) {
        // return the new state (don't update the old state)
        return Object.assign({}, state, {
          currentEventId: null,
          currentEvent: null,
          events: remainingEvents
        });
      } else {
        // return the new state (don't update the old state)
        return Object.assign({}, state, {
          events: remainingEvents
        });
      }

    default:
      return state;
  }
});
