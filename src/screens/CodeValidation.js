import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {Content, Button, Text, Item, Input, Label, StyleProvider} from 'native-base';
import Container from '../components/Container';
import PropTypes from 'prop-types';
import {login} from '../actions/authentication'
import {AUTHENTICATION_METHOD_PHONE} from '../constants'
import {connect} from "react-redux";
import {onChangeTextInput} from '../helpers/input';
import Header from '../components/Header';
import {resetAndNavigateTo} from '../helpers/navigation';

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
      }
    }));
  };

  render() {
    return (
      <Container>
        <Header {...this.props} showLogout={false} title={this.props.headerTitle}/>
        <Content contentContainerStyle={styles.content}>
          <Item style={styles.item} floatingLabel>
            <Label>Validation Code</Label>
            <Input onChangeText={text => this._onChangeTextInput('code', text)} returnKeyType='done' keyboardType="number-pad"
                   placeholder=""/>
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
  },
  item: {
    paddingTop: 20,
  }
});


function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(CodeValidation);
