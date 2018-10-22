import {callApi} from '../api';

export const GET_USERS = 'GET_USERS';

export function getUsers(query, cb) {
  return function (dispatch, getState) {
    return callApi(dispatch, getState, 'GET', '/users' + query, null, GET_USERS, cb);
  }
}
