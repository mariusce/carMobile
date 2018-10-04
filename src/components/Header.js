import React, {Component} from 'react';
import {Image, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {Header, StyleProvider, Left, Button, Icon, Body, Title, Right, View, Content} from 'native-base';
import platform from '../../native-base-theme/variables/platform';
import getTheme from '../../native-base-theme/components';
import {connect} from "react-redux";
import {resetAndNavigateTo} from "../helpers/navigation";
import {flushState} from "../actions/global";


class _Header extends Component {
  constructor(props) {
    super(props);
  }

  _onPressBackButton = () => {
    this.props.navigation.goBack();
  };

  _onPressLogoutButton = () => {
    this.props.dispatch(flushState());
    resetAndNavigateTo(this.props, 'Welcome');
  };

  render() {
    return (
      <StyleProvider style={getTheme(platform)}>
        <Header>
          <Left style={{flexDirection: 'row', alignItems: 'center'}}>
            {this.props.showBack &&
            <Button onPress={this._onPressBackButton}>
              <Icon type="Feather" name="arrow-left"/>
            </Button>
            }
          </Left>
          <Body>
          <Title style={styles.title}>{this.props.title}</Title>
          </Body>
          <Right>
            {this.props.showLogout &&
              <Button onPress={this._onPressLogoutButton} transparent>
                <Icon name='power'/>
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
};

_Header.defaultProps = {
  title: '',
  showBack: true,
  showLogout: true
};

const styles = StyleSheet.create({
  title: {
    color: '#ffffff',
    textAlign: 'center',
    justifyContent: 'center',
  }
});

function mapStateToProps(state) {
  return {
  };
}

export default connect(mapStateToProps)(_Header);
