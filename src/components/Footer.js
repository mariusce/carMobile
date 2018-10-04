import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {StyleProvider, Button, Icon, Footer, FooterTab, Text} from 'native-base';
import platform from '../../native-base-theme/variables/platform';
import getTheme from '../../native-base-theme/components';
import {connect} from "react-redux";


class _Footer extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    return (
      <StyleProvider style={getTheme(platform)}>
        <Footer>
          <FooterTab>
            <Button vertical>
                <Icon name="list" />
                <Text>Apps</Text>
            </Button>
            <Button vertical>
                <Icon name="camera" />
                <Text>Camera</Text>
            </Button>
            <Button vertical active>
                <Icon active name="compass" />
                <Text>Navigate</Text>
            </Button>
            <Button vertical>
                <Icon name="user" />
                <Text>Contact</Text>
            </Button>
            </FooterTab>
          </Footer>
      </StyleProvider>
    );
  }
}


const styles = StyleSheet.create({

});

function mapStateToProps(state) {
  return {
  };
}

export default connect(mapStateToProps)(_Footer);
