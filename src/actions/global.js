export const INIT_DONE = 'persist/REHYDRATE';
export const SET_LOADING = 'SET_LOADING';
export const SET_ERROR = 'SET_ERROR';
import {FLUSH_STATE} from "../constants";


export function setLoading(loading) {
    return {
        type: SET_LOADING,
        value: loading
    };
}

export function setError(error) {
    return {
        type: SET_ERROR,
        value: error
    };
}

export function flushState() {
  return {
    type: FLUSH_STATE,
    value: null
  };
}
