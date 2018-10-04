import {combineReducers} from 'redux';
import global from './global';
import authentication from './authentication';
import users from './users';


const rootReducer = combineReducers({
  global,
  authentication,
  users
});

export default rootReducer;
