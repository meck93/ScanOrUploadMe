import eventReducer from '../../../src/reducers/eventReducer';
import { setCurrentEvent, addEvent, modifyEvent, deleteEvent } from '../../../src/actions/eventActions';

describe('Redux: Calendar Reducer', () => {
  it('should return the initial state', () => {
    const mockRepsonse = {
      currentEventId: null,
      currentEvent: null,
      events: []
    };
    expect(eventReducer(undefined, {})).toEqual(mockRepsonse);
  });

  it('should handle ADD_EVENT', () => {
    const mockRepsonseAddEvent = {
      currentEventId: null,
      currentEvent: null,
      events: [{ id: 1 }, { id: 2 }]
    };

    expect(
      eventReducer(
        {
          currentEventId: null,
          currentEvent: null,
          events: [{ id: 1 }]
        },
        addEvent({ id: 2 })
      )
    ).toEqual(mockRepsonseAddEvent);
  });

  it('should handle SET_CURRENT_EVENT', () => {
    const mockRepsonseSetCurrentEvent = {
      currentEventId: 1,
      currentEvent: { id: 1 },
      events: [{ id: 1 }, { id: 2 }]
    };

    expect(
      eventReducer(
        {
          currentEventId: null,
          currentEvent: null,
          events: [{ id: 1 }, { id: 2 }]
        },
        setCurrentEvent(1)
      )
    ).toEqual(mockRepsonseSetCurrentEvent);
  });

  it('should handle MODIFY_EVENT', () => {
    const mockResponseModifyEvent = {
      currentEventId: null,
      currentEvent: null,
      events: [{ id: 1, text: 'test' }, { id: 2, text: 'not-test' }]
    };

    expect(
      eventReducer(
        {
          currentEventId: null,
          currentEvent: null,
          events: [{ id: 1, text: 'test' }, { id: 2, text: 'test' }]
        },
        modifyEvent({ id: 2, text: 'not-test' })
      )
    ).toEqual(mockResponseModifyEvent);
  });

  it('should handle DELETE_EVENT', () => {
    const mockResponseDeleteEventNonCurrent = {
      currentEventId: null,
      currentEvent: null,
      events: [{ id: 1, text: 'test' }]
    };

    // remove the non-current event
    expect(
      eventReducer(
        {
          currentEventId: null,
          currentEvent: null,
          events: [{ id: 1, text: 'test' }, { id: 2, text: 'test' }]
        },
        deleteEvent(2)
      )
    ).toEqual(mockResponseDeleteEventNonCurrent);

    // remove the current event
    expect(
      eventReducer(
        {
          currentEventId: 2,
          currentEvent: { id: 2, text: 'test' },
          events: [{ id: 1, text: 'test' }, { id: 2, text: 'test' }]
        },
        deleteEvent(2)
      )
    ).toEqual(mockResponseDeleteEventNonCurrent);
  });
});
