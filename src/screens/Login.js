import React, {Component} from 'react';
import {Image, StyleSheet} from 'react-native';
import {Content, Button, Text, Item, Input, Label, StyleProvider, Toast, Icon, View} from 'native-base';
import Container from '../components/Container';
import PropTypes from 'prop-types';
import {onChangeTextInput} from '../helpers/input';
import {login} from '../actions/authentication'
import {connect} from "react-redux";
import {errorCodeToText} from '../helpers/utils';
import {saveChatPassword, forgotPassword} from '../actions/authentication';
import Modal from 'react-native-modal';


class Login extends Component {

  constructor(props) {
    super(props);
    this.carNumber = this.props.navigation.getParam('carNumber');
    this.state = {
      carNumber: '',
      password: '',
      showToast: false,
      modalVisible: 0,
    };
    this._onChangeTextInput = onChangeTextInput.bind(this);
  }

  _setModal = (visible) => {
    let state = Object.assign({}, this.state);
    state.modalVisible = visible;
    this.setState(state);
  };

  _onPressSignInButton = () => {
    const data = {
      id: this.carNumber,
      secret: this.state.password,
      method: 'password'
    };
    this.props.dispatch(login(data, (error, json) => {
      if (!error) {
        this.props.dispatch(saveChatPassword(data.secret));
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

  _onPressRecoverPassword = () => {
    this.props.dispatch(forgotPassword(this.carNumber, (error, json) => {
        if (!error) {
          this._setModal(1);
          console.log ('An email has been sent to ' + json.email + ' with the ne password');
        }
    }))
  };

  render() {
    let PasswordResetModal =
          <Modal
            isVisible={this.state.modalVisible === 1}
            onBackdropPress={() => {
              this._setModal(0)
            }}
            animationIn="zoomIn"
            animationOut="zoomOut">
            <View style={styles.modalContent}>
              <Text>A new password has been generated for your account and sent to your email address</Text>
              <Text/>
              <Text/>
              <View>
                <Button onPress={() => {this._setModal(0)}}>
                  <Text>OK</Text>
                </Button>
              </View>
            </View>
          </Modal>;

    return (
      <Container>
        <Content contentContainerStyle={styles.content}>

          <View style={styles.logo}><Image source={require('../../assets/image/car-logo.png')}/></View>

          <View style={styles.header}><Text style={styles.headerText}>Welcome!</Text></View>

          <View style={styles.carNumber}><Text style={styles.carNumberText}>{this.carNumber}</Text></View>

          <View style={styles.sub}><Text style={styles.subtext}>Enter your account password</Text></View>

          <Item rounded>
            <Icon type="Ionicons" active name='key' />
            <Input onChangeText={text => this._onChangeTextInput('password', text)} secureTextEntry={true} placeholder="password"/>
          </Item>

          <Button full style={styles.button} onPress={this._onPressSignInButton}>
            <Text>{this.props.singInButtonText}</Text>
          </Button>

          <View style={styles.forgotPassword}>
            <Button transparent full dark style={styles.button} onPress={this._onPressRecoverPassword}>
              <Text>Forgot your password?</Text>
            </Button>
          </View>

          <View style={styles.modal}>
            {PasswordResetModal}
          </View>

        </Content>
      </Container>
    );
  }
}

Login.propTypes = {
  singUpButtonText: PropTypes.string,
};

Login.defaultProps = {
  singInButtonText: 'SIGN IN'
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    margin: 10,
  },
  button: {
    margin: 10,
    marginTop: 30,
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
  forgotPassword: {
    alignItems: 'center',
  },
  modal: {
    justifyContent: "center",
    alignItems: "center"
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
});


function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(Login);
