import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {Content, Button, Text, Item, Input, Label, StyleProvider, Toast, Icon} from 'native-base';
import Container from '../components/Container';
import PropTypes from 'prop-types';
import {onChangeTextInput} from '../helpers/input';
import {register, saveChatPassword} from '../actions/authentication'
import {connect} from "react-redux";
import {errorCodeToText} from '../helpers/utils';
import {EMAIL_REGEX} from '../constants';
// import xmldom from 'xmldom';
// window.DOMParser = xmldom.DOMParser;
// window.document = new DOMParser().parseFromString("<?xml version='1.0'?>", 'text/xml');
// import '../../lib/strophe.js/strophe.js';
// import 'strophejs-plugins/register/strophe.register';
// import {XMPP_DOMAIN, XMPP_HTTP_SERVICE_URI} from '../constants';
// import _ from "lodash";
//
// const Strophe = window.Strophe;
// let connection = null;


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
        // this._registerToChatServer();
        this.props.dispatch(saveChatPassword(this.state.password));
        this.props.navigation.navigate('App');
      } else {
        Toast.show({
          text: errorCodeToText(json),
          buttonText: "Okay",
          type: "danger",
          duration: 3000
        });
      }
    }));
  };

  // _registerToChatServer = () => {
  //   const state = this.state;
  //   connection = new Strophe.Connection(XMPP_HTTP_SERVICE_URI);
  //   connection.rawInput = this._rawInput;
  //   connection.rawOutput = this._rawOutput;
  //   connection.register.connect(XMPP_DOMAIN, function (status) {
  //     switch (status) {
  //       case Strophe.Status.REGISTER:
  //         connection.register.fields.username = _.toLower(state.carNumber);
  //         connection.register.fields.password = state.password;
  //         console.info("registering...");
  //         connection.register.submit();
  //         break;
  //       case Strophe.Status.REGISTERED:
  //         console.info("Registered!");
  //         connection.disconnect();
  //         break;
  //       case Strophe.Status.CONFLICT:
  //           console.error("Username already exists.");
  //         break;
  //       case Strophe.Status.NOTACCEPTABLE:
  //           console.error("Registration form not properly filled out.");
  //         break;
  //       case Strophe.Status.REGIFAIL:
  //         console.log("The Server does not support In-Band Registration");
  //         break;
  //       case Strophe.Status.CONNECTED:
  //         console.info("Connected.");
  //         break;
  //       case Strophe.Status.DISCONNECTING:
  //         console.log("Disconnecting...");
  //         break;
  //       case Strophe.Status.DISCONNECTED:
  //         console.log("Disconnected.");
  //         break;
  //       default:
  //         break;
  //     }
  //   }, 60, 1);
  // };
  //
  // _rawInput = (data) => {
  //   console.log('RECV: ' + data);
  // };
  // _rawOutput = (data) => {
  //   console.log('SENT: ' + data);
  // };

  render() {
    return (
      <Container>
        <Content contentContainerStyle={styles.content}>
          <Item error={!this.state.carNumberValid} rounded>
            <Icon type="Ionicons" active name='car' />
            <Input onChangeText={text => this._onChangeTextInput('carNumber', text)} placeholder="license plate *"/>
            {!this.state.carNumberValid && <Icon type="Ionicons" name='close-circle' />}
          </Item>
          <Text/>
          <Item error={!this.state.passwordValid} rounded>
            <Icon type="Ionicons" active name='key' />
            <Input type="password" onChangeText={text => this._onChangeTextInput('password', text)} secureTextEntry={true} placeholder="password *"/>
            {!this.state.passwordValid && <Icon type="Ionicons" name='close-circle' />}
          </Item>
          <Text/>
          <Item rounded>
            <Icon type="Ionicons" active name='contact' />
            <Input onChangeText={text => this._onChangeTextInput('firstName', text)} placeholder="first name"/>
          </Item>
          <Text/>
          <Item rounded>
            <Icon type="Ionicons" active name='contact' />
            <Input onChangeText={text => this._onChangeTextInput('lastName', text)} placeholder="last name"/>
          </Item>
          <Text/>
          <Item error={!this.state.emailValid} rounded>
            <Icon type="Ionicons" active name='mail' />
            <Input type="email" onChangeText={text => this._onChangeTextInput('email', text)} placeholder="email"/>
            {!this.state.emailValid && <Icon type="Ionicons" name='close-circle' />}
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
  inputCarNumber: {
    textTransform: 'uppercase'
  }
});

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(Register);
