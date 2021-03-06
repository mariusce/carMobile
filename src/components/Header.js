import React, {Component} from 'react';
import {Image, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {Header, StyleProvider, Left, Button, Icon, Body, Title, Right, View, Content} from 'native-base';
import platform from '../../native-base-theme/variables/platform';
import getTheme from '../../native-base-theme/components';
import {connect} from "react-redux";
import {flushState} from "../actions/global";
import {logout} from '../actions/authentication';
import Feather from 'react-native-vector-icons/Feather';


class _Header extends Component {
  constructor(props) {
    super(props);
  }

  _onPressBackButton = () => {
    if (this.props.backTo) {
      this.props.navigation.navigate(this.props.backTo);
    } else {
      this.props.navigation.goBack();
    }
  };

  _onPressLogoutButton = () => {
    this.props.dispatch(flushState());
    this.props.dispatch(logout());
    this.props.navigation.navigate('Auth');
  };

  render() {
    return (
      <StyleProvider style={getTheme(platform)}>
        <Header>
          <Left >
            {this.props.showBack &&
            <Button onPress={this._onPressBackButton} transparent>
              <Feather name='arrow-left' color={platform.activeTintColor} size={30}/>
            </Button>
            }
          </Left>
          <Body style={styles.body}>
            <Title >{this.props.title}</Title>
          </Body>
          <Right>
            {this.props.showLogout &&
              <Button onPress={this._onPressLogoutButton} transparent>
                <Feather name='power' color={platform.activeTintColor} size={20}/>
              </Button>
            }
          </Right>
        </Header>
      </StyleProvider>
    );
  }
}

_Header.propTypes = {
  title: PropTypes.string,
  showBack: PropTypes.bool,
  showLogout: PropTypes.bool,
  backTo: PropTypes.string
};

_Header.defaultProps = {
  title: '',
  showBack: false,
  showLogout: true,
  backTo: ''
};

const styles = StyleSheet.create({
  left: {
    justifyContent: 'center',
    alignItems:     'center'
  },
  body: {
    justifyContent: 'center',
    alignItems:     'center'
  }
});

function mapStateToProps(state) {
  return {
  };
}

export default connect(mapStateToProps)(_Header);
