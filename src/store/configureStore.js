import {AsyncStorage} from 'react-native';
import { createStore, applyMiddleware} from 'redux';
import {persistStore, autoRehydrate} from 'redux-persist'
import rootReducer from '../reducers';
import thunk from 'redux-thunk';
import {createLogger} from 'redux-logger';

export const store = createStore(
  rootReducer,
  applyMiddleware(thunk, createLogger()),
  autoRehydrate({log:true})
);

export default function configureStore() {
    persistStore(store, {storage: AsyncStorage, blacklist: ['global']}, () => {});
    return store;
};
