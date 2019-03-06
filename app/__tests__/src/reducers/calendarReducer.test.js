import calendarReducer from "../../../src/reducers/calendarReducer";
import { setDefaultCalendar } from "../../../src/actions/calendarActions";

describe("Redux: Calendar Reducer", () => {
  it("should return the initial state", () => {
    const mockRepsonse = { activeCalendarId: null };
    expect(calendarReducer(undefined, {})).toEqual(mockRepsonse);
  });

  it("should handle SET_DEFAULT_CALENDAR", () => {
    const mockRepsonse = { activeCalendarId: 1 };

    expect(calendarReducer({}, setDefaultCalendar(1))).toEqual(mockRepsonse);
  });
});
