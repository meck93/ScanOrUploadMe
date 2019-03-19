import { makeRequest } from "./uploadImage";
import { AuthSession, Constants } from "expo";

const AUTH0_DOMAIN = "https://dev-meck93.eu.auth0.com";
const AUTH0_CLIENT_ID = "0X74tvmbhZVT8rCy81lzukRzx1WAZp1D";
const REDIRECT_URL = AuthSession.getRedirectUrl();
const BASE_API = getBaseTargetURI();

function toQueryString(params) {
  return (
    "?" +
    Object.entries(params)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join("&")
  );
}

function getBaseTargetURI() {
  // load default URL depending if development or productive
  let { manifest } = Constants;

  const api =
    typeof manifest.packagerOpts === `object` && manifest.packagerOpts.dev
      ? manifest.debuggerHost
          .split(`:`)
          .shift()
          .concat(`:3000`)
      : `scanoruploadme.herokuapp.com`;

  return api;
}

async function generateChallengeAndVerifier() {
  // create target REST endpoint
  let apiUrl = `http://${BASE_API}/auth`;

  try {
    // send get request to /auth endpoint
    const response = await makeRequest(apiUrl, {});
    const responseJson = await response.json();
    return responseJson;
  } catch (error) {
    console.log(error);
    throw new Error(
      `Unsuccessfull Challenge Generation Request: ${JSON.stringify(error)}`
    );
  }
}

async function sendAuthChallenge(challenge) {
  const params = {
    client_id: AUTH0_CLIENT_ID,
    response_type: "code",
    code_challenge: challenge,
    code_challenge_method: "S256",
    scope: "openid profile email",
    redirect_uri: REDIRECT_URL,
    audience: "https://scanoruploadme.herokuapp.com/",
    state: "ABC123"
  };

  const options = toQueryString(params);

  let authUrl = `${AUTH0_DOMAIN}/authorize` + options;

  const result = await AuthSession.startAsync({
    authUrl: authUrl
  });

  if (result.type === "success" && result.params.state === params.state) {
    return result;
  } else {
    console.log("Unsuccessfull challenge request:", result);
    throw new Error(
      `Unsuccessfull challenge request: ${JSON.stringify(result)}`
    );
  }
}

async function sendAuthCodeAndVerifier(authCode, verifier) {
  let body = {
    grant_type: "authorization_code",
    code_verifier: encodeURIComponent(verifier),
    code: authCode,
    client_id: AUTH0_CLIENT_ID,
    redirect_uri: REDIRECT_URL
  };

  let options = {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  };

  let apiUrl = `${AUTH0_DOMAIN}/oauth/token`;

  try {
    const response = await makeRequest(apiUrl, options);
    const responseJson = await response.json();

    if (responseJson.access_token) {
      return responseJson.access_token;
    } else {
      throw new Error("No Access Token Received!");
    }
  } catch (error) {
    console.log(error);
    throw new Error(
      `Unsuccessfull Verification Request: ${JSON.stringify(error)}`
    );
  }
}

async function testBackendAPI(accessToken) {
  // create http POST request options
  let options = {
    method: "GET",
    headers: {
      authorization: `Bearer ${accessToken}`
    }
  };

  // create target REST endpoint
  let apiUrl = `http://${BASE_API}/test`;

  try {
    const response = await makeRequest(apiUrl, options);
    return response;
  } catch (error) {
    console.log(error);
  }
}

async function getAccessToken() {
  try {
    // generate code challenge and verifier
    const generationResponse = await generateChallengeAndVerifier();
    const challenge = generationResponse.code_challenge;
    const verifier = generationResponse.verifier;

    // send auth challenge
    const authResponse = await sendAuthChallenge(challenge);
    const authCode = authResponse.params.code;

    // send auth verification
    const accessToken = await sendAuthCodeAndVerifier(authCode, verifier);
    return accessToken;
  } catch (error) {
    console.log(error);
  }
}

export {
  generateChallengeAndVerifier,
  sendAuthChallenge,
  sendAuthCodeAndVerifier,
  getAccessToken,
  testBackendAPI
};
