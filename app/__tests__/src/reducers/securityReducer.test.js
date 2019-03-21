import securityReducer from "../../../src/reducers/securityReducer";
import { setTokens, clearTokens } from "../../../src/actions/securityActions";

describe("Redux: Calendar Reducer", () => {
  it("should return the initial state", () => {
    const mockRepsonse = {
      accessToken: null,
      idToken: null,
      refreshToken: null,
      expires_in: null
    };

    expect(securityReducer(undefined, {})).toEqual(mockRepsonse);
  });

  it("should handle SET_ACCESS_TOKEN", () => {
    const tokens = {
      accessToken: "TEST-ACCESS",
      idToken: "TEST-ID",
      refreshToken: "TEST-REFRESH",
      expires_in: 86400
    };

    const mockResponse = {
      accessToken: "TEST-ACCESS",
      idToken: "TEST-ID",
      refreshToken: "TEST-REFRESH",
      expires_in: Date.now() + 86400
    };

    expect(calendarReducer({}, setTokens(tokens))).toEqual(mockResponse);
  });

  it("should handle CLEAR_ACCESS_TOKEN", () => {
    const someState = {
      accessToken: "TEST-ACCESS",
      idToken: "TEST-ID",
      refreshToken: "TEST-REFRESH",
      expires_in: Date.now() + 86400
    };

    const mockResponse = {
      accessToken: null,
      idToken: null,
      refreshToken: null,
      expires_in: null
    };

    expect(calendarReducer(someState, clearTokens())).toEqual(mockResponse);
  });
});
