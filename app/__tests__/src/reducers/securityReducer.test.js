import securityReducer from "../../../src/reducers/securityReducer";
import {
  setAccessToken,
  clearAccessToken
} from "../../../src/actions/securityActions";

describe("Redux: Calendar Reducer", () => {
  it("should return the initial state", () => {
    const mockRepsonse = { accessToken: null };

    expect(securityReducer(undefined, {})).toEqual(mockRepsonse);
  });

  it("should handle SET_ACCESS_TOKEN", () => {
    const mockRepsonse = { accessToken: "TOKEN-FAKE-TOKEN" };

    expect(calendarReducer({}, setAccessToken("TOKEN-FAKE-TOKEN"))).toEqual(
      mockRepsonse
    );
  });

  it("should handle CLEAR_ACCESS_TOKEN", () => {
    const someState = { accessToken: "TOKEN-FAKE-TOKEN" };
    const mockResponse = { accessToken: null };

    expect(calendarReducer(someState, clearAccessToken())).toEqual(
      mockResponse
    );
  });
});
