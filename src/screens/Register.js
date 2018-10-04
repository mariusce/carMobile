import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {Content, Button, Text, Item, Input, Label, StyleProvider} from 'native-base';
import Container from '../components/Container';
import PropTypes from 'prop-types';
import {onChangeTextInput} from '../helpers/input';
import {register} from '../actions/authentication'
import {connect} from "react-redux";
import {resetAndNavigateTo} from "../helpers/navigation";


class Register extends Component {

  constructor(props) {
    super(props);
    this.state = {carNumber: '', password: '', firstName: '', lastName: '', email: ''};
    this._onChangeTextInput = onChangeTextInput.bind(this);
  }

  _onPressSignUpButton = () => {
    this.props.dispatch(register(this.state, (error, json) => {
      if (!error) {
        resetAndNavigateTo(this.props, 'Home');
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
          <Item style={styles.item} floatingLabel>
            <Label>First Name</Label>
            <Input onChangeText={text => this._onChangeTextInput('firstName', text)} placeholder=""/>
          </Item>
          <Item style={styles.item} floatingLabel>
            <Label>Last Name</Label>
            <Input onChangeText={text => this._onChangeTextInput('lastName', text)} placeholder=""/>
          </Item>
          <Item style={styles.item} floatingLabel>
            <Label>Email</Label>
            <Input onChangeText={text => this._onChangeTextInput('email', text)} placeholder=""/>
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
  }
});


function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(Register);
