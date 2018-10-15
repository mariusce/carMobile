import {API_URL} from '../constants'
import {setLoading, setError} from '../actions/global';


function setSuccess(caller, json) {
  return {
    type: caller,
    value: json
  };
}

function fail(dispatch, message, code, cb) {
  dispatch(setLoading(false));
  dispatch(setError(message));
  if (cb) {
     return cb(message, code);
  }
  return Promise.reject(message);
}

function success(dispatch, caller, json, cb) {
  dispatch(setLoading(false));
  if (caller) {
    dispatch(setSuccess(caller, json));
  }
  if (cb) {
    cb(null, json);
  }
  return Promise.resolve(json);
}

export function callApi(dispatch, getState, method, path, body, caller, cb) {

  dispatch(setLoading(true));
  dispatch(setError(null));

  let state = getState();

  let headers = {
    Accept: 'application/json, text/plain, */*',
  };

  if (state.authentication && state.authentication.token) {
    headers['Authorization'] = state.authentication.token;
  }

  if (body) {
    headers['Content-Type'] = 'application/json';
  }

  return fetch(API_URL + path, {
    method: method,
    headers: headers,
    body: body ? JSON.stringify(body) : null,
  }).then(response => {
    if (response.ok) {
      return response.json().then(json => {
        return success(dispatch, caller, json, cb);
      });
    }
    return response.json().then(json => {
      return fail(dispatch, json.message, json && json.code,  cb);
    }).catch((error) => {
      return fail(dispatch, error, error && error.code, cb);
    });
  }, error => {
    if (error && typeof error === 'object') {
      if (error.message) {
        error = error.message;
      } else {
        error = JSON.stringify(error);
      }
    }
    return fail(dispatch, error, error && error.code, cb);
  });
}
