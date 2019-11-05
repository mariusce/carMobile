export const HOST_URL = 'http://10.10.10.7:3030/api/v1';

export const API_URL = HOST_URL;
export const UPLOADS_URL = HOST_URL + '/uploads/';
export const TOKEN_NOT_SET = 'TOKEN_NOT_SET';

export const SIGN_IN_CONTEXT = 'SIGN_IN_CONTEXT';
export const SIGN_UP_CONTEXT = 'SIGN_UP_CONTEXT';
export const AUTHENTICATION_METHOD_PHONE = 'phone';
export const AUTHENTICATION_METHOD_PASSWORD = 'password';
export const FLUSH_STATE = 'FLUSH_STATE';

export const SHOW_ERROR = true;

export const XMPP_PORT = '5280';
export const XMPP_DOMAIN = '10.10.10.7';
export const XMPP_WS_SERVICE_URI = 'ws://' + XMPP_DOMAIN + ':' + XMPP_PORT + '/xmpp';
export const XMPP_HTTP_SERVICE_URI = 'http://' + XMPP_DOMAIN + ':' + XMPP_PORT + '/http-bind/';

// eslint-disable-next-line
export const EMAIL_REGEX = /^\w+([\.\-\!\#\$\%\&\‘\*\+\/\=\?\^\`\{\|\}\~]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
