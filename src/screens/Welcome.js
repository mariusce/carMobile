import React, {Component} from 'react';
import {Image, StyleSheet} from 'react-native';
import {Content, Button, Text, StyleProvider, View, Icon, Input, Item, Toast} from 'native-base';
import Container from '../components/Container';
import PropTypes from 'prop-types';
import {AUTHENTICATION_METHOD_PASSWORD, SIGN_IN_CONTEXT, SIGN_UP_CONTEXT} from '../constants'
import connect from 'react-redux/es/connect/connect';
import {onChangeTextInput} from '../helpers/input';
import {errorCodeToText} from '../helpers/utils';
import {doesUserExist} from '../actions/authentication'
import _ from 'lodash';

class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      carNumber: '',
      carNumberValid: true,
    };
    this._onChangeTextInput = onChangeTextInput.bind(this);
  }

  _onPressContinueButton = () => {
    // validate input
    let state = Object.assign({}, this.state);
    if (!this.state.carNumber || this.state.carNumber.length < 6) {
      state.carNumberValid = false;
      this.setState(state);
      return;
    }
    this.props.dispatch(doesUserExist(this.state.carNumber, (error, json) => {
      if (!error) {
        if (json.exists) {
          this.props.navigation.navigate('Login', {carNumber: this.state.carNumber});
        } else {
          let state = Object.assign({}, this.state);
          state.authentication = {
            token: json.accessToken
          };
          this.setState(state);
          this.props.navigation.navigate('Register', {carNumber: this.state.carNumber});
        }
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

          <View style={styles.sub}><Text style={styles.subtext}>Your license plate here</Text></View>

          <View style={styles.input}>
            <Item error={!this.state.carNumberValid} rounded>
              <Icon type="Ionicons" active name='car' />
              <Input onChangeText={text => this._onChangeTextInput('carNumber', text)}/>
              {!this.state.carNumberValid && <Icon type="Ionicons" name='close-circle' />}
            </Item>
          </View>

          <Button full style={styles.button} onPress={this._onPressContinueButton}>
            <Text>Continue</Text>
          </Button>

        </Content>
      </Container>
    );
  }
}

Welcome.propTypes = {
  singInButtonText: PropTypes.string,
  singUpButtonText: PropTypes.string,
};

Welcome.defaultProps = {
  singInButtonText: 'SIGN IN',
  singUpButtonText: 'SIGN UP'
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
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
  },
  subtext: {
    fontWeight: 'bold',
  },
  input: {
    alignItems: 'center',
    margin: 20
  },
  button: {
    margin: 10
  }
});

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(Welcome);