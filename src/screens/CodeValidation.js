import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {Content, Button, Text, Item, Input, Label, StyleProvider, Toast, Icon} from 'native-base';
import Container from '../components/Container';
import PropTypes from 'prop-types';
import {login} from '../actions/authentication'
import {AUTHENTICATION_METHOD_PHONE} from '../constants'
import {connect} from "react-redux";
import {onChangeTextInput} from '../helpers/input';
import Header from '../components/Header';
import {errorCodeToText} from '../helpers/utils';

class CodeValidation extends Component {

  constructor(props) {
    super(props);
    this.state = {code: ''};
    this._onChangeTextInput = onChangeTextInput.bind(this);
  }

  _onPressSendValidate = () => {
    const phone = this.props.navigation.getParam('phone');
    const code = this.state.code;
    let data = {
      id: phone,
      secret: code,
      method: AUTHENTICATION_METHOD_PHONE
    };

    this.props.dispatch(login(data, (error, json) => {
      if (!error) {
        this.props.navigation.navigate('Register');
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
          <Item rounded>
            <Icon type="Ionicons" active name='key' />
            <Input onChangeText={text => this._onChangeTextInput('code', text)}
                   returnKeyType='done' keyboardType="number-pad" secureTextEntry={true}
                   placeholder="validation code"/>
          </Item>
        </Content>
        <Button full style={styles.button} onPress={this._onPressSendValidate}>
          <Text>{this.props.validateButtonText}</Text>
        </Button>
      </Container>
    );
  }
}

CodeValidation.propTypes = {
  validateButtonText: PropTypes.string,
  headerTitle: PropTypes.string,
};

CodeValidation.defaultProps = {
  validateButtonText: 'Validate',
  headerTitle: 'Code'
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    margin: 10
  },
  button: {
    margin: 10
  }
});


function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(CodeValidation);
