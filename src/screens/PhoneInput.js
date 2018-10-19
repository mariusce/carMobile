import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {Content, Button, Text, Item, Input, Label, StyleProvider, Toast} from 'native-base';
import Container from '../components/Container';
import PropTypes from 'prop-types';
import {sendAuthenticationCode} from '../actions/authentication';
import {onChangeTextInput} from '../helpers/input';
import {connect} from "react-redux";
import Header from "../components/Header";
import {errorCodeToText} from '../helpers/utils';

class PhoneInput extends Component {

  constructor(props) {
    super(props);
    this.state = {phone: ''};
    this._onChangeTextInput = onChangeTextInput.bind(this);
  }

  _onPressSendValidationCode = () => {
    const phone = this.state.phone;
    this.props.dispatch(sendAuthenticationCode(phone, false, (error, json) => {
      if (!error) {
        this.props.navigation.navigate('CodeValidation', {phone: phone});
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
        <Header {...this.props} showLogout={false} title={this.props.headerTitle}/>
        <Content contentContainerStyle={styles.content}>
          <Item style={styles.item} floatingLabel>
            <Label>Phone Number</Label>
            <Input onChangeText={text => this._onChangeTextInput('phone', text)} value={this.state.phone}
                   keyboardType="phone-pad" returnKeyType='done' placeholder=""/>
          </Item>
        </Content>
        <Button full style={styles.button} onPress={this._onPressSendValidationCode}>
          <Text>{this.props.sendValidationCodeButtonText}</Text>
        </Button>
      </Container>
    );
  }
}

PhoneInput.propTypes = {
  sendValidationCodeButtonText: PropTypes.string,
  headerTitle: PropTypes.string,

};

PhoneInput.defaultProps = {
  sendValidationCodeButtonText: 'Send Validation Code',
  headerTitle: 'Phone'
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

export default connect(mapStateToProps)(PhoneInput);
