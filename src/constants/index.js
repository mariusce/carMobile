export const HOST_URL = 'http://10.10.10.7:3030/api/v1';
//export const HOST_URL = 'http://10.10.9.29:3030/api/v1';
//export const HOST_URL = 'http://192.168.1.106:3030/api/v1';//'http://goni.c-scale.ro/api/v1';

export const API_URL = HOST_URL;
export const UPLOADS_URL = HOST_URL + '/uploads/';
export const TOKEN_NOT_SET = 'TOKEN_NOT_SET';

export const SIGN_IN_CONTEXT = 'SIGN_IN_CONTEXT';
export const SIGN_UP_CONTEXT = 'SIGN_UP_CONTEXT';
export const AUTHENTICATION_METHOD_PHONE = 'phone';
export const FLUSH_STATE = 'FLUSH_STATE';

export const SHOW_ERROR = true;

export const XMPP_PORT = '7070';
export const XMPP_DOMAIN = 'marius.lan';
export const XMPP_SERVICE_URI = 'ws://' + XMPP_DOMAIN + ':' + XMPP_PORT + '/ws/';

// eslint-disable-next-line
export const EMAIL_REGEX = /^\w+([\.\-\!\#\$\%\&\‘\*\+\/\=\?\^\`\{\|\}\~]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
