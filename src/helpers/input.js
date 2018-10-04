
export function onChangeTextInput (property, text) {
    let state = Object.assign({}, this.state);
    state[property] = text;
    this.setState(state);
}
