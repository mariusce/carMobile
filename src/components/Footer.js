import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {StyleProvider, Button, Icon, Footer, FooterTab, Text, Badge} from 'native-base';
import platform from '../../native-base-theme/variables/platform';
import getTheme from '../../native-base-theme/components';
import {connect} from "react-redux";
import {resetAndNavigateTo} from "../helpers/navigation";
import PropTypes from "prop-types";


class _Footer extends Component {

  _onPressGoHome = () => {
    this.props.navigation.navigate('Home');
  };

  _onPressGoToContacts = () => {
    this.props.navigation.navigate('Contacts');
  };

  _onPressGoToMessages = () => {
    this.props.navigation.navigate('Messages');
  };


  render() {
    return (
      <StyleProvider style={getTheme(platform)}>
        <Footer>
          <FooterTab>
            <Button vertical active={this.props.active === 'home'}
                    onPress={this._onPressGoHome}>
              <Icon name="home" />
              <Text>Home</Text>
            </Button>
            <Button vertical badge active={this.props.active === 'contacts'}
                    onPress={this._onPressGoToContacts}>
              <Badge><Text>2</Text></Badge>
              <Icon name="users" />
              <Text>Contacts</Text>
            </Button>
            <Button vertical badge active={this.props.active === 'messages'}
                    onPress={this._onPressGoToMessages}>
              <Badge><Text>2</Text></Badge>
              <Icon name="message-square" />
              <Text>Messages</Text>
            </Button>
            </FooterTab>
          </Footer>
      </StyleProvider>
    );
  }
}

_Footer.propTypes = {
  active: PropTypes.string,
};

_Footer.defaultProps = {
  active: 'home'
};

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(_Footer);
