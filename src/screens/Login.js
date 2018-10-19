import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {Content, Button, Text, Item, Input, Label, StyleProvider, Toast} from 'native-base';
import Container from '../components/Container';
import PropTypes from 'prop-types';
import {onChangeTextInput} from '../helpers/input';
import {login} from '../actions/authentication'
import {connect} from "react-redux";
import {errorCodeToText} from '../helpers/utils';


class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      carNumber: '',
      password: '',
      showToast: false
    };
    this._onChangeTextInput = onChangeTextInput.bind(this);
  }

  _onPressSignInButton = () => {
    const data = {
      id: this.state.carNumber,
      secret: this.state.password,
      method: 'password'
    };
    this.props.dispatch(login(data, (error, json) => {
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
          <Item style={styles.item} floatingLabel>
              <Label>Car number</Label>
              <Input onChangeText={text => this._onChangeTextInput('carNumber', text)} placeholder=""/>
          </Item>
          <Item style={styles.item} floatingLabel>
            <Label>Password</Label>
            <Input onChangeText={text => this._onChangeTextInput('password', text)} placeholder=""/>
          </Item>
        </Content>
        <Button full style={styles.button} onPress={this._onPressSignInButton}>
          <Text>{this.props.singInButtonText}</Text>
        </Button>
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
    margin: 10
  },
  button: {
    margin: 10
  },
  item: {
    paddingTop: 10,
  }
});


function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(Login);
