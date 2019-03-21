import securityReducer from "../../../src/reducers/securityReducer";
import { setTokens, clearTokens } from "../../../src/actions/securityActions";

describe("Redux: Security Reducer", () => {
  it("should return the initial state", () => {
    const mockRepsonseInit = {
      accessToken: null,
      idToken: null,
      refreshToken: null,
      expires_in: null
    };

    expect(securityReducer(undefined, {})).toEqual(mockRepsonseInit);
  });

  it("should handle SET_ACCESS_TOKEN", () => {
    const tokens = {
      access_token: "TEST-ACCESS",
      id_token: "TEST-ID",
      refresh_token: "TEST-REFRESH",
      expires_in: 86400
    };

    const mockResponseSet = {
      accessToken: "TEST-ACCESS",
      idToken: "TEST-ID",
      refreshToken: "TEST-REFRESH",
      expires_in: Date.now() + 86400
    };

    const state = securityReducer({}, setTokens(tokens));
    expect(state.accessToken).toEqual(mockResponseSet.accessToken);
    expect(state.idToken).toEqual(mockResponseSet.idToken);
    expect(state.refreshToken).toEqual(mockResponseSet.refreshToken);
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

    expect(securityReducer(someState, clearTokens())).toEqual(mockResponse);
  });
});
