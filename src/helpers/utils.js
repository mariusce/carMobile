export function errorCodeToText (code) {
  let text = '';
  switch (code) {
    case 400: text = 'Invalid input data'; break;
    case 403: text = 'Authentication error'; break;
    case 404: text = 'User not found'; break;
    default: text = 'Internal error';
  }
  return text;
}