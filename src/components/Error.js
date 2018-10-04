import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {View, Text, StyleProvider} from 'native-base';
import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';
import PropTypes from 'prop-types';
import {connect} from "react-redux";

class Error extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
          <StyleProvider style={getTheme(platform)}>
            <View>
              <Text>{this.props.message && this.props.message}</Text>
            </View>
          </StyleProvider>
          );
    }
}

Error.propTypes = {
    message: PropTypes.string,
};

Error.defaultProps = {
    message: undefined,
};

const styles = StyleSheet.create({
});


function mapStateToProps(state) {
    const message = state.global.error;
    return {
        message: message
    };
}

export default connect(mapStateToProps)(Error);
