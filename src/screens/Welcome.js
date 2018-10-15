import React, {Component} from 'react';
import {Image, StyleSheet} from 'react-native';
import {Content, Button, Text, StyleProvider, View, Left} from 'native-base';
import Container from '../components/Container';
import PropTypes from 'prop-types';
import {SIGN_IN_CONTEXT, SIGN_UP_CONTEXT} from '../constants'

export default class Welcome extends Component {
  render() {
    return (
      <Container>
        <Content contentContainerStyle={styles.content}>

          <View style={styles.logo}><Image source={require('../../assets/image/car-logo.png')}/></View>

          <Button full style={styles.button} onPress={() => {
            this.props.navigation.navigate('Login')
          }}>
            <Text>{this.props.singInButtonText}</Text>
          </Button>

          <Button full style={styles.button} onPress={() => {
            this.props.navigation.navigate('PhoneInput')
          }}>
            <Text>{this.props.singUpButtonText}</Text>

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
    paddingBottom: 50
  },
  button: {
    margin: 10
  }
});
