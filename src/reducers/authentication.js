import { LOGIN, LOGOUT, GET_AUTHENTICATED_USER, REGISTER, CHAT } from '../actions/authentication';
import {FLUSH_STATE, TOKEN_NOT_SET} from '../constants';
import {parseJwt} from '../helpers/jwt'
import _ from 'lodash';

const INITIAL_STATE = {
    userId: null,
    phone: null,
    loggedInAt: null,
    iat: null,
    aud: null,
    exp: null,
    iss: null,
    sub: null,
    token: TOKEN_NOT_SET,
    user: {},
    chat:'',
};

export default function (state = INITIAL_STATE, action) {
    let now = new Date();
    switch (action.type) {
        case LOGIN:
            return Object.assign({}, state, {token: action.value.accessToken, loggedInAt: now.toISOString()}, parseJwt(action.value.accessToken));
        case LOGOUT:
            return Object.assign({}, state, INITIAL_STATE);
        case GET_AUTHENTICATED_USER:
          return Object.assign({}, state, {
            user: action.value || {},
            isFetching: false
          });
        case REGISTER:
            return Object.assign({}, state, {user: _.omit(action.value, ['accessToken']), token: action.value.accessToken, loggedInAt: now.toISOString()}, parseJwt(action.value.accessToken));
        case FLUSH_STATE:
          return Object.assign({}, state, INITIAL_STATE);
        case CHAT:
          return Object.assign({}, state, {chat: action.value});
        default:
            return state;
    }
}
