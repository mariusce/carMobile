import _ from 'lodash';

export function onChangeTextInput (property, text) {
  let state = Object.assign({}, this.state);
  switch (property) {
    case 'carNumber' :
      state.carNumberValid = true;
      state[property] = _.toUpper(text);
      break;
    case 'password':
      state.passwordValid = true;
      state[property] = text;
      break;
    case 'email':
      state.emailValid = true;
      state[property] = text;
      break;
    default:
      state[property] = text;
  }
  this.setState(state);
}