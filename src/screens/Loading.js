import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {Content, Spinner, StyleProvider} from 'native-base';
import Container from '../components/Container';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {resetAndNavigateTo} from "../helpers/navigation";

import {TOKEN_NOT_SET} from '../constants';

class Loading extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.isInitDone) {
      if (TOKEN_NOT_SET === this.props.token) {
        resetAndNavigateTo(this.props, 'Welcome');
      } else {
        resetAndNavigateTo(this.props, 'Home');
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isInitDone) {
      if (TOKEN_NOT_SET === nextProps.token) {
        resetAndNavigateTo(this.props, 'Welcome');
      } else {
        resetAndNavigateTo(this.props, 'Home');
      }
    }
  }

  render() {
    return (
      <Container>
        <Content contentContainerStyle={styles.content}>
          <Spinner/>
        </Content>
      </Container>
    );
  }
}

Loading.propTypes = {
  token: PropTypes.string,
  isInitDone: PropTypes.bool
};

Loading.defaultProps = {
  token: TOKEN_NOT_SET,
  isInitDone: false
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
  }
});

function mapStateToProps(state) {
  const token = state.authentication && state.authentication.token || '';
  const isInitDone = state.global.isInitDone;
  return {
    token: token,
    isInitDone: isInitDone
  };
}

export default connect(mapStateToProps)(Loading);
