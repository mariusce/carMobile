import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {Content, Button, Text, Item, Input, Label, StyleProvider, Toast, Icon} from 'native-base';
import Container from '../components/Container';
import PropTypes from 'prop-types';
import {onChangeTextInput} from '../helpers/input';
import {register} from '../actions/authentication'
import {connect} from "react-redux";
import {errorCodeToText} from '../helpers/utils';
import {EMAIL_REGEX} from '../constants';


class Register extends Component {

  constructor(props) {
    super(props);
    this.state = {
      carNumber: '', password: '', firstName: '', lastName: '', email: '',
      carNumberValid: true, passwordValid: true, emailValid: true
    };
    this._onChangeTextInput = onChangeTextInput.bind(this);
  }

  _onPressSignUpButton = () => {
    // validate inputs
    let state = Object.assign({}, this.state);
    if (!this.state.carNumber || this.state.carNumber.length < 6) { state.carNumberValid = false; }
    if (!this.state.password || this.state.password.length < 4) { state.passwordValid = false; }
    if (this.state.email && !EMAIL_REGEX.test(String(this.state.email).toLowerCase())) { state.emailValid = false; }
    if (!state.carNumberValid || !state.passwordValid || !state.emailValid) { this.setState(state); return; }

    this.props.dispatch(register(this.state, (error, json) => {
      if (!error) {
        this.props.navigation.navigate('App');
      } else {
        Toast.show({
          text: errorCodeToText(json),
          buttonText: "Okay",
          type: "danger"
        });
      }
    }));
  };

  render() {
    return (
      <Container>
        <Content contentContainerStyle={styles.content}>
          <Item error={!this.state.carNumberValid} style={styles.item} floatingLabel>
            <Label>Car number *</Label>
            <Input onChangeText={text => this._onChangeTextInput('carNumber', text)} placeholder=""/>
            {!this.state.carNumberValid && <Icon name='x-circle' />}
          </Item>
          <Item error={!this.state.passwordValid} style={styles.item} floatingLabel>
            <Label>Password *</Label>
            <Input type="password" onChangeText={text => this._onChangeTextInput('password', text)} placeholder=""/>
            {!this.state.passwordValid && <Icon name='x-circle' />}
          </Item>
          <Item style={styles.item} floatingLabel>
            <Label>First Name</Label>
            <Input onChangeText={text => this._onChangeTextInput('firstName', text)} placeholder=""/>
          </Item>
          <Item style={styles.item} floatingLabel>
            <Label>Last Name</Label>
            <Input onChangeText={text => this._onChangeTextInput('lastName', text)} placeholder=""/>
          </Item>
          <Item error={!this.state.emailValid} style={styles.item} floatingLabel>
            <Label>Email</Label>
            <Input type="email" onChangeText={text => this._onChangeTextInput('email', text)} placeholder=""/>
            {!this.state.emailValid && <Icon name='x-circle' />}
          </Item>
        </Content>
        <Button full style={styles.button} onPress={this._onPressSignUpButton}>
          <Text>{this.props.singUpButtonText}</Text>
        </Button>
      </Container>
    );
  }
}

Register.propTypes = {
  singUpButtonText: PropTypes.string,
};

Register.defaultProps = {
  singUpButtonText: 'SIGN UP'
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    margin: 10
  },
  button: {
    margin: 10
  },
  item: {
    paddingTop: 20,
  },
  inputCarNumber: {
    textTransform: 'uppercase'
  }
});

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(Register);
