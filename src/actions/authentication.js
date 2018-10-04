import {callApi} from '../api'

export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const REGISTER = 'REGISTER';
export const GET_AUTHENTICATED_USER = 'GET_AUTHENTICATED_USER';
export const SEND_AUTHENTICATION_CODE = 'SEND_AUTHENTICATION_CODE';

export function login(data, cb) {
    return function (dispatch, getState) {
        return callApi(dispatch, getState, 'POST', '/authentication?type=user', data, LOGIN, cb);
    }
}

export function register(data, cb) {
    return function (dispatch, getState) {
        return callApi(dispatch, getState, 'POST', '/users', data, REGISTER, cb);
    }
}

export function logout() {
    return {
        type: LOGOUT,
        value: true
    };
}

export function getAuthenticatedUser(cb) {
    return function (dispatch, getState) {
        return callApi(dispatch, getState, 'GET', '/users/' + getState().authentication.userId, null, GET_AUTHENTICATED_USER, cb);
    }
}

export function sendAuthenticationCode(phone, exist, cb) {
    return function (dispatch, getState) {
        return callApi(dispatch, getState, 'GET', `/authentication?type=user&phone=${phone}&exist=${exist}`, null, SEND_AUTHENTICATION_CODE, cb);
    }
}
