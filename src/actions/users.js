import {callApi} from '../api';

export const GET_USERS = 'GET_USERS';
export const UPDATE_USER = 'PUT_USER';

export function getUsers(query, cb) {
  return function (dispatch, getState) {
    return callApi(dispatch, getState, 'GET', '/users' + query, null, GET_USERS, cb);
  }
}

export function updateUser(data, cb) {
  return function (dispatch, getState) {
    return callApi(dispatch, getState, 'PATCH', '/users/'+ getState().authentication.userId, data, UPDATE_USER, cb);
  }
}