import {
    GET_USERS
} from '../actions/users';

import {FLUSH_STATE} from '../constants';

const INITIAL_STATE = {
  data: null,
  isFetching: false
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_USERS:
      return Object.assign({}, state, {
        data: action.value && action.value.data || [],
        isFetching: false
      });
    case FLUSH_STATE:
      return Object.assign({}, state, INITIAL_STATE);
    default:
      return state;
  }
}
