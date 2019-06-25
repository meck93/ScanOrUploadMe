import { makeRequest } from './uploadImage';
import { AuthSession } from 'expo';
import * as Random from 'expo-random';
import * as Crypto from 'expo-crypto';
import Constants from 'expo-constants';

var Buffer = require('buffer/').Buffer;

const AUTH0_DOMAIN = 'https://dev-meck93.eu.auth0.com';
const AUTH0_CLIENT_ID = '0X74tvmbhZVT8rCy81lzukRzx1WAZp1D';
const REDIRECT_URL = getRedirectURL();
const BASE_API = getBaseTargetURI();

function toQueryString(params) {
    return (
        '?' +
        Object.entries(params)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&')
    );
}

function getRedirectURL() {
    return AuthSession.getRedirectUrl();
}

// encoding an input as base64 string and replace all characters (+, /, =) to make the encoding URL and filename safe
// see: https://tools.ietf.org/html/rfc4648#section-5
function base64URLEncode(str) {
    return str
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

function getBaseTargetURI() {
    // load default URL depending if development or productive
    let { manifest } = Constants;

    const api =
        typeof manifest.packagerOpts === 'object' && manifest.packagerOpts.dev
            ? manifest.debuggerHost
                  .split(':')
                  .shift()
                  .concat(':3000')
            : 'scanoruploadme.herokuapp.com';

    return api;
}

async function generateChallengeAndVerifier() {
    // generates cryptographically strong 32 bytes of pseudo-random data => IV (initialization vector)
    const randomBytes = await Random.getRandomBytesAsync(32);
    const arr = Buffer.from(randomBytes);
    const verifier = base64URLEncode(arr);

    // produce a SHA-256 hash of the IV (in base64 format)=> code_challenge
    const digest = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, verifier, {
        encoding: 'base64'
    });
    const challenge = base64URLEncode(digest);

    return [verifier, challenge];
}

async function sendAuthChallenge(challenge) {
    const params = {
        client_id: AUTH0_CLIENT_ID,
        response_type: 'code',
        code_challenge: challenge,
        code_challenge_method: 'S256',
        scope: 'openid profile email offline_access',
        redirect_uri: REDIRECT_URL,
        audience: 'https://scanoruploadme.herokuapp.com/',
        state: 'ABC123'
    };

    const options = toQueryString(params);

    let authUrl = `${AUTH0_DOMAIN}/authorize` + options;

    const result = await AuthSession.startAsync({
        authUrl: authUrl
    });

    if (result.type === 'success' && result.params.state === params.state) {
        return result;
    } else {
        throw new Error(`Unsuccessfull Challenge Request: ${JSON.stringify(result)}`);
    }
}

async function sendAuthCodeAndVerifier(authCode, verifier) {
    let body = {
        grant_type: 'authorization_code',
        code_verifier: encodeURIComponent(verifier),
        code: authCode,
        client_id: AUTH0_CLIENT_ID,
        redirect_uri: REDIRECT_URL
    };

    let options = {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body)
    };

    let apiUrl = `${AUTH0_DOMAIN}/oauth/token`;

    try {
        const response = await makeRequest(apiUrl, options);
        const responseJson = await response.json();

        if (responseJson.access_token) {
            // return full response object with (access_token, id_token, refresh_token)
            return responseJson;
        } else {
            throw new Error('No Access Token Received!');
        }
    } catch (error) {
        throw new Error(`Unsuccessfull Verification Request: ${JSON.stringify(error)}`);
    }
}

async function refreshAccessToken(refreshToken) {
    let body = {
        grant_type: 'refresh_token',
        client_id: AUTH0_CLIENT_ID,
        refresh_token: refreshToken
    };

    let options = {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body)
    };

    let apiUrl = `${AUTH0_DOMAIN}/oauth/token`;

    try {
        const response = await makeRequest(apiUrl, options);
        const responseJson = await response.json();

        if (responseJson.access_token) {
            // return full response object with (access_token, id_token)
            return responseJson;
        } else {
            throw new Error('No Access Token Received!');
        }
    } catch (error) {
        throw new Error(`Unsuccessfull Token Refresh Request Request: ${JSON.stringify(error)}`);
    }
}

async function getAccessToken() {
    try {
        // generate code challenge and verifier
        const [verifier, challenge] = await generateChallengeAndVerifier();

        // send auth challenge
        const authResponse = await sendAuthChallenge(challenge);
        const authCode = authResponse.params.code;

        // send auth verification
        const tokens = await sendAuthCodeAndVerifier(authCode, verifier);

        // return retrieved tokens (access_token, id_token, refresh_token)
        return tokens;
    } catch (error) {
        console.error(error);
    }
}

async function testBackendAPI(accessToken) {
    // create http POST request options
    let options = {
        method: 'GET',
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
        console.error(error);
    }
}

export { generateChallengeAndVerifier, sendAuthChallenge, sendAuthCodeAndVerifier, getAccessToken, testBackendAPI };
