import {callApi} from '../api';

export const GET_USERS = 'GET_USERS';

export function getUsers(cb) {
  return function (dispatch, getState) {
    return callApi(dispatch, getState, 'GET', '/users', null, GET_USERS, cb);
  }
}
