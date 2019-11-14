import React, {Component} from 'react';
import {Image, StyleSheet} from 'react-native';
import {Content, Button, Text, Item, Input, Label, StyleProvider, Toast, Icon, View} from 'native-base';
import Container from '../components/Container';
import PropTypes from 'prop-types';
import {onChangeTextInput} from '../helpers/input';
import {register} from '../actions/authentication'
import {connect} from "react-redux";
import {errorCodeToText} from '../helpers/utils';
import {EMAIL_REGEX} from '../constants';
import _ from 'lodash';


class Register extends Component {

  constructor(props) {
    super(props);
    this.carNumber = this.props.navigation.getParam('carNumber');
    this.state = {
      password: '', passwordCheck: '', firstName: '', lastName: '', phone: '', email: '',
      passwordValid: true, passwordsMatch: true, emailValid: true
    };
    this._onChangeTextInput = onChangeTextInput.bind(this);
  }

  _checkPasswordsMatch = () => {
    let state            = Object.assign({}, this.state);
    state.passwordsMatch = (state.password === state.passwordCheck);
    this.setState(state);
  };

  _onPressSignUpButton = () => {
    // validate inputs
    let state = Object.assign({}, this.state);
    if (!state.password || state.password.length < 4) { state.passwordValid = false; }
    if (state.password !== state.passwordsMatch) { state.passwordsMatch = false; }
    if (this.state.email && !EMAIL_REGEX.test(String(this.state.email).toLowerCase())) { state.emailValid = false; }
    if (!state.passwordValid || !state.emailValid) { this.setState(state); return; }

    let data = Object.assign({}, {carNumber: this.carNumber}, this.state);
    this.props.dispatch(register(data, (error, json) => {
      if (!error) {
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

  render() {
    return (
      <Container>
        <Content contentContainerStyle={styles.content}>

          <View style={styles.logo}><Image source={require('../../assets/image/car-logo.png')}/></View>

          <View style={styles.header}><Text style={styles.headerText}>Welcome!</Text></View>

          <View style={styles.sub}><Text style={styles.subtext}>You don't have an account. Let's create one</Text></View>

          <View style={styles.carNumber}><Text style={styles.carNumberText}>{this.carNumber}</Text></View>

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
          <Item error={!this.state.passwordValid} rounded>
            <Icon type="Ionicons" active name='key' />
            <Input type="password" onChangeText={text => this._onChangeTextInput('password', text)} secureTextEntry={true} placeholder="password *"/>
            {!this.state.passwordValid && <Icon type="Ionicons" name='close-circle' />}
          </Item>
          <Text/>
          <Item error={!this.state.passwordsMatch} rounded>
            <Icon type="Ionicons" active name='key' />
            <Input type="password" onChangeText={text => this._onChangeTextInput('passwordCheck', text)} onBlur={this._checkPasswordsMatch}
                   secureTextEntry={true} placeholder="check password *"/>
            {!this.state.passwordsMatch && <Icon type="Ionicons" name='close-circle' />}
          </Item>
          <Text/>
          <Item error={!this.state.emailValid} rounded>
            <Icon type="Ionicons" active name='mail' />
            <Input type="email" onChangeText={text => this._onChangeTextInput('email', _.toLower(text))} placeholder="email *"/>
            {!this.state.emailValid && <Icon type="Ionicons" name='close-circle' />}
          </Item>
          <Text/>
          <Item rounded>
            <Icon type="Ionicons" active name='phone-portrait' />
            <Input onChangeText={text => this._onChangeTextInput('phone', text)} value={this.state.phone}
                   keyboardType="phone-pad" returnKeyType='done' placeholder="phone"/>
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
    justifyContent: 'center',
    margin: 10
  },
  button: {
    margin: 10
  },
  inputCarNumber: {
    textTransform: 'uppercase'
  },
  logo: {
    justifyContent:'center',
    alignItems: 'center',
    paddingBottom: 30
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 30
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 30,
    color: '#999'
  },
  sub: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20
  },
  subtext: {
    fontWeight: 'bold',
  },
  carNumber: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20
  },
  carNumberText: {
    color: '#999',
  },
});

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(Register);
